import { promises as fs } from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const GITHUB_QUERY = `
  query($login: String!) {
    user(login: $login) {
      name
      bio
      followers { totalCount }
      following { totalCount }
      repositories(first: 100, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS, direction: DESC}) {
        nodes {
          name
          description
          stargazerCount
          languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
            edges {
              size
              node { name color }
            }
          }
        }
      }
      contributionsCollection {
        contributionCalendar {
          totalContributions
        }
        totalCommitContributions
        totalPullRequestContributions
        totalIssueContributions
      }
    }
  }
`;

type DeviconStyle = 'original' | 'plain' | 'line' | 'original-wordmark' | 'plain-wordmark' | 'line-wordmark';

export const getDeviconUrl = (name: string, style: DeviconStyle = 'original'): string => {
  return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${name}/${name}-${style}.svg`;
};

async function getBase64Icon(name: string): Promise<string> {
  try {
    const url = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${name}/${name}-original.svg`;
    const response = await fetch(url);
    if (!response.ok) return '';

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return `data:image/svg+xml;base64,${buffer.toString('base64')}`;
  } catch {
    return '';
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const { searchParams } = new URL(req.url);
  const filePath = path.join(process.cwd(), 'public', 'themes.json');
  const jsonData = await fs.readFile(filePath, 'utf8');

  const themes = JSON.parse(jsonData);
  const themeName = searchParams.get('theme') || 'tokyonight';
  const theme = themes[themeName] || themes.tokyonight;

  const showProfile = searchParams.get('profile') !== 'false';
  const showStats = searchParams.get('stats') !== 'false';
  const showStack = searchParams.get('stack') !== 'false';
  const showRepos = searchParams.get('repos') !== 'false';

  const showCustomStack = searchParams.get('customstack') === 'true';

  const customStacksParam = searchParams.get('stacks');
  const customStacks = customStacksParam
    ? [
        ...new Set(
          customStacksParam
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0),
        ),
      ]
    : [];

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GITHUB_QUERY,
        variables: { login: username },
      }),
      next: { revalidate: 86400 },
    });

    const result = await response.json();
    if (result.errors || !result.data?.user) return new NextResponse('User not found', { status: 404 });

    const svg = await generateSVG(result.data.user, username, theme, {
      showProfile,
      showStats,
      showStack,
      showRepos,
      showCustomStack,
      customStacks,
    });

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}

interface RenderOptions {
  showProfile: boolean;
  showStats: boolean;
  showStack: boolean;
  showRepos: boolean;
  showCustomStack: boolean;
  customStacks: string[];
}

async function generateSVG(user: any, username: string, theme: any, options: RenderOptions) {
  const { showProfile, showStats, showStack, showRepos, showCustomStack, customStacks } = options;

  let totalStars = 0;
  const langMap: Record<string, { size: number; color: string }> = {};

  user.repositories.nodes.forEach((repo: any) => {
    totalStars += repo.stargazerCount;
    repo.languages.edges.forEach((edge: any) => {
      if (!langMap[edge.node.name]) langMap[edge.node.name] = { size: 0, color: edge.node.color };
      langMap[edge.node.name].size += edge.size;
    });
  });

  const sortedLangs = Object.entries(langMap)
    .sort((a: any, b: any) => b[1].size - a[1].size)
    .slice(0, 5);
  const totalSize = sortedLangs.reduce((acc, [_, val]: any) => acc + val.size, 0);

  const pinnedRepos = user.repositories.nodes.slice(0, 4);
  const totalContributions = user.contributionsCollection.contributionCalendar.totalContributions;
  const stats = user.contributionsCollection;

  let currentY = 65;
  const blockSpacing = 20;
  const profileHeight = showProfile ? 120 : 0;
  const statsHeight = showStats || showStack ? 120 : 0;
  const reposHeight = showRepos ? 200 : 0;
  let customStackHeight = 0;
  if (showCustomStack && customStacks.length > 0) {
    const rows = Math.ceil(customStacks.length / 8);
    customStackHeight = rows * 45 + 55;
  }
  if (showProfile) currentY += profileHeight + blockSpacing;
  if (showStats || showStack) currentY += statsHeight + blockSpacing;
  if (showRepos) currentY += reposHeight + blockSpacing;
  if (showCustomStack && customStacks.length > 0) currentY += customStackHeight + blockSpacing;

  const svgHeight = currentY + 50;

  const drawHeaderBlock = (x: number, y: number, text: string, bgColor: string) => `
    <g transform="translate(${x}, ${y})">
      <rect width="140" height="20" fill="${bgColor}" />
      <path d="M140 0L155 10L140 20V0Z" fill="${bgColor}" />
      <text x="10" y="14" font-family="monospace" font-weight="bold" font-size="11" fill="${theme.bg}">${text}</text>
    </g>
  `;

  const renderDevicon = async (stack: string, index: number) => {
    const base64Data = await getBase64Icon(stack.toLowerCase());
    if (!base64Data) return '';

    const xPos = 10 + (index % 11) * 45;
    const yPos = 45 + Math.floor(index / 11) * 45;

    return `
      <g transform="translate(${xPos}, ${yPos})">
        <image href="${base64Data}" x="0" y="0" width="35" height="35" />
      </g>
    `;
  };
  const iconsPromises = showCustomStack ? customStacks.map((stack, index) => renderDevicon(stack, index)) : [];

  const resolvedIcons = (await Promise.all(iconsPromises)).join('');

  return `
    <svg width="600" height="${svgHeight}" viewBox="0 0 600 ${svgHeight}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        .mono { font-family: 'SFMono-Regular', Consolas, monospace; }
        @keyframes typing { from { width: 0; } to { width: 100%; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .typewriter { display: inline-block; overflow: hidden; white-space: nowrap; border-right: 3px solid ${theme.command}; animation: typing 1.5s steps(30, end) forwards; width: 0; }
        .content-fade { animation: fadeIn 0.8s ease-out forwards; animation-delay: 1s; opacity: 0; }
        .repo-desc { 
          color: ${theme.subtext}; 
          font-family: monospace; 
          font-size: 10px; 
          line-height: 1.2;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      </style>

      <rect width="600" height="${svgHeight}" rx="10" fill="${theme.bg}" />
      <rect width="600" height="35" rx="10" fill="${theme.header}" />
      <circle cx="20" cy="17" r="6" fill="#ff5f56"/><circle cx="40" cy="17" r="6" fill="#ffbd2e"/><circle cx="60" cy="17" r="6" fill="#27c93f"/>
      <text x="300" y="22" text-anchor="middle" fill="${theme.subtext}" class="mono" font-size="12">ssh admin@github — ${username}</text>

      <g transform="translate(25, 65)" class="mono">
        <foreignObject x="0" y="-15" width="550" height="45">
          <div xmlns="http://www.w3.org/1999/xhtml" style="color: ${theme.text}; font-family: monospace; font-size: 14px;">
            <span style="color: ${theme.command}">● user@machine</span> <span style="color: ${theme.subtext}">in</span> <span style="color: ${theme.prompt}">~/stats</span> 
            <br/>
            <span class="typewriter" style="color: ${theme.accent}">$ fetch-github-stats --user @${username}</span>
          </div>
        </foreignObject>

        <g class="content-fade">
          <!-- Perfil do Usuário -->
          ${
            showProfile
              ? `
            <g transform="translate(0, 50)">
              ${drawHeaderBlock(0, 0, 'USER PROFILE', theme.accent)}
              <g transform="translate(10, 40)">
                <text font-size="18" font-weight="bold" fill="${theme.text}">${user.name || username}</text>
                <text y="22" font-size="11" fill="${theme.subtext}">${user.bio?.substring(0, 60) || 'GitHub Contributor'}</text>
                <text y="42" font-size="11" fill="${theme.command}">
                  Followers: <tspan fill="${theme.text}">${user.followers.totalCount}</tspan> 
                  <tspan fill="${theme.subtext}"> | </tspan> 
                  Following: <tspan fill="${theme.text}">${user.following?.totalCount || 0}</tspan>
                </text>
              </g>
            </g>
          `
              : ''
          }

          <!-- Estatísticas e Stack -->
          ${
            showStats || showStack
              ? `
            <g transform="translate(0, ${showProfile ? 160 : 50})">
              <line x1="0" y1="0" x2="550" y2="0" stroke="${theme.header}" stroke-width="1" />
              <g transform="translate(0, 20)">
                ${
                  showStats
                    ? `
                  ${drawHeaderBlock(0, 0, 'SYSTEM STATS', theme.prompt)}
                  <text x="10" y="45" font-size="12" fill="${theme.text}">Total Activity: <tspan font-weight="bold" fill="${theme.stats}">${totalContributions}</tspan></text>
                  <text x="10" y="65" font-size="12" fill="${theme.text}">Stars Earned:   <tspan font-weight="bold" fill="${theme.stats}">${totalStars}</tspan></text>
                  <text x="10" y="85" font-size="12" fill="${theme.text}">Commits (Pub):  <tspan font-weight="bold" fill="${theme.stats}">${stats.totalCommitContributions}</tspan></text>
                `
                    : ''
                }

                ${
                  showStack
                    ? `
                  <g transform="translate(${showStats ? '280' : '0'}, 0)">
                    ${drawHeaderBlock(0, 0, 'CORE STACK', theme.command)}
                    ${sortedLangs
                      .map(
                        ([name, info]: any, i: number) => `
                      <g transform="translate(10, ${35 + i * 18})">
                        <text font-size="10" fill="${theme.text}">${name.padEnd(10, ' ')}</text>
                        <rect x="75" y="-7" width="120" height="4" rx="2" fill="${theme.header}"/>
                        <rect x="75" y="-7" width="${(info.size / totalSize) * 120}" height="4" rx="2" fill="${info.color}"/>
                      </g>
                    `,
                      )
                      .join('')}
                  </g>
                `
                    : ''
                }
              </g>
            </g>
          `
              : ''
          }

          <!-- Repositórios -->
          ${
            showRepos
              ? `
            <g transform="translate(0, ${(showProfile ? 160 : 50) + (showStats || showStack ? 120 : 0) + 30})">
              <line x1="0" y1="0" x2="550" y2="0" stroke="${theme.header}" stroke-width="1" />
              ${drawHeaderBlock(0, 20, 'TOP REPOSITORIES', theme.stats)}
              <g transform="translate(10, 65)">
                ${pinnedRepos
                  .map((repo: any, i: number) => {
                    const col = i % 2;
                    const row = Math.floor(i / 2);
                    return `
                  <g transform="translate(${col * 280}, ${row * 75})">
                    <text font-size="12" font-weight="bold" fill="${theme.accent}">${repo.name.length > 20 ? repo.name.substring(0, 17) + '...' : repo.name}</text>
                    <text x="0" y="15" fill="${theme.stats}" font-size="10">★ ${repo.stargazerCount}</text>
                    <foreignObject x="0" y="18" width="250" height="45">
                      <div xmlns="http://www.w3.org/1999/xhtml" class="repo-desc">
                        ${repo.description || 'No description available...'}
                      </div>
                    </foreignObject>
                  </g>
                `;
                  })
                  .join('')}
              </g>
            </g>
          `
              : ''
          }

          <!-- Stack Personalizada -->
        ${
          showCustomStack && customStacks.length > 0
            ? `
        <g transform="translate(0, ${(showProfile ? 160 : 50) + (showStats || showStack ? 120 : 0) + (showRepos ? 200 : 0) + 30})">
          <line x1="0" y1="0" x2="550" y2="0" stroke="${theme.header}" stroke-width="1" />
          ${drawHeaderBlock(0, 20, 'TECH STACK', theme.accent)}
          <g transform="translate(0, 20)">
            ${resolvedIcons}
          </g>
        </g>
      `
            : ''
        }

          <!-- Cursor piscante -->
          <g transform="translate(0, ${svgHeight - 85})">
            <text fill="${theme.command}" font-size="12">➜ <tspan fill="${theme.accent}">~</tspan></text>
            <rect width="8" height="15" x="25" y="-11" fill="${theme.command}">
              <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" />
            </rect>
          </g>
        </g>
      </g>
    </svg>
  `;
}

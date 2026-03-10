#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  TextContent,
  ToolError,
} from '@modelcontextprotocol/sdk/types.js';
import { listFilesTool } from './tools/list_files.js';
import { getFileContentTool } from './tools/get_file_content.js';
import { analyzeFileTool } from './tools/analyze_file.js';

interface Tool {
  name: string;
  description: string;
  inputSchema: any;
  execute(args: any): Promise<any>;
}

const tools: Tool[] = [listFilesTool, getFileContentTool, analyzeFileTool];

// Create the MCP server
const server = new Server(
  {
    name: 'udp-mcp-server',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle ListTools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: tools.map(t => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema,
    })),
  };
});

// Handle CallTool request
server.setRequestHandler(CallToolRequestSchema, async (request): Promise<{ content: TextContent[]; isError?: boolean }> => {
  const tool = tools.find(t => t.name === request.params.name);

  if (!tool) {
    return {
      content: [
        {
          type: 'text',
          text: `Unknown tool: ${request.params.name}`,
        },
      ],
      isError: true,
    };
  }

  try {
    const result = await tool.execute(request.params.arguments || {});

    // Convert result to JSON string
    const resultText = typeof result === 'string' ? result : JSON.stringify(result, null, 2);

    return {
      content: [
        {
          type: 'text',
          text: resultText,
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    return {
      content: [
        {
          type: 'text',
          text: `Tool error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Connect transport and run server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(err => {
  console.error('Server error:', err);
  process.exit(1);
});

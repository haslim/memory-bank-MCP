import { startServer } from './mcp/memoryBankMcp.js';

// Ana fonksiyon
async function main() {
  console.log('Starting Memory Bank MCP server...');
  
  try {
    // MCP sunucusunu başlat
    await startServer();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Uygulamayı başlat
main().catch(error => {
  console.error('Critical error:', error);
  process.exit(1);
});

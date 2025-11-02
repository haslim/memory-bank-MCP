import { initializeMemoryBankDirectly } from './dist/mcp/memoryBankMcp.js';

// Test the memory bank initialization
async function testInitialization() {
  try {
    console.log('Starting memory bank initialization...');
    
    const result = await initializeMemoryBankDirectly({
      goal: 'HomiQR is a comprehensive smart building management system that provides QR-based access control, visitor management, resident services, and administrative oversight through multiple applications (admin panel, resident mobile app, and visitor web app)',
      location: 'C:/Users/Haydar/Desktop/denemeapp/homiqr'
    });
    
    console.log('Initialization result:', result);
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

testInitialization();

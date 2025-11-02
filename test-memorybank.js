import { readAllDocuments } from './dist/utils/fileManager.js';
import path from 'path';

async function testMemoryBankFunctionality() {
  try {
    const memoryBankDir = path.resolve('../memory-bank');
    console.log('Testing memory bank at:', memoryBankDir);
    
    const documents = await readAllDocuments(memoryBankDir);
    console.log('✅ Found documents:', Object.keys(documents));
    
    // Verify each document exists and has content
    const expectedDocuments = ['projectbrief', 'productContext', 'systemPatterns', 'techContext', 'activeContext', 'progress'];
    let allValid = true;
    
    for (const docType of expectedDocuments) {
      if (documents[docType] && documents[docType].length > 0) {
        console.log(`✅ ${docType}.md - Valid (${documents[docType].length} characters)`);
      } else {
        console.log(`❌ ${docType}.md - Missing or empty`);
        allValid = false;
      }
    }
    
    if (allValid) {
      console.log('\n🎉 Memory Bank initialization completed successfully!');
      console.log('\n📁 Memory Bank Location:', memoryBankDir);
      console.log('\n📄 Generated Documents:');
      expectedDocuments.forEach(doc => {
        console.log(`   - ${doc}.md`);
      });
      console.log('\n🔧 Memory Bank MCP server is ready for use!');
    } else {
      console.log('\n❌ Memory Bank initialization has issues');
    }
    
  } catch (error) {
    console.error('❌ Memory bank test failed:', error);
  }
}

testMemoryBankFunctionality();

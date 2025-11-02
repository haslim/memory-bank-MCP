import path from 'path';
import fs from 'fs-extra';
import { generateAllDocuments } from './dist/utils/gemini.js';
import { createMemoryBankStructure, saveDocument } from './dist/utils/fileManager.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current directory for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Direct initialization function
async function initializeMemoryBankDirectly(goal, location) {
  try {
    console.log('Starting direct memory bank initialization...');
    console.log(`Goal: ${goal}`);
    console.log(`Location: ${location}`);
    
    // Determine where to create the memory-bank directory
    let baseDir;
    if (path.isAbsolute(location)) {
      baseDir = location;
    } else {
      baseDir = path.resolve(process.cwd(), location);
    }
    
    const memoryBankDir = path.join(baseDir, 'memory-bank');
    console.log(`Will create Memory Bank structure at: ${memoryBankDir}`);
    
    // Ensure parent directory exists if needed
    const parentDir = path.dirname(memoryBankDir);
    await fs.ensureDir(parentDir);
    
    // Ensure memory-bank directory exists
    await fs.ensureDir(memoryBankDir);
    console.log(`Created Memory Bank root directory: ${memoryBankDir}`);
    
    // Set up the .byterules file
    const byterulesDest = path.join(memoryBankDir, '.byterules');
    const defaultByterules = `# Memory Bank Document Orchestration Standard

## Directory Validation

Before any operation (create/update/reference/review), ensure you are in the correct project root directory. Specifically:

- A valid Memory Bank system **must contain** this \`.byterules\` file at its root.
- If this file is missing, halt operations and **navigate to the correct directory** using:

\`\`\`bash
cd /your/project/root
\`\`\`

Failing to validate the directory can lead to misplaced or inconsistent documentation.

---

## System Overview

Memory Bank is a structured documentation system designed to maintain project knowledge in an organized, accessible format. This \`.byterules\` file serves as the standard guide for how the system works across all projects.

## Standard Document Types

### 1. Project Brief (projectbrief.md)
- **Purpose**: Core document that defines project objectives, scope, and vision
- **When to Use**: Reference when making any major project decisions
- **Workflow Step**: Start here; all other documents derive from this foundation
- **Critical For**: Maintaining alignment with business goals throughout development

### 2. Product Context (productContext.md)
- **Purpose**: Documents product functionality from a user perspective
- **When to Use**: When designing features and establishing requirements
- **Workflow Step**: Second document in sequence, expands on project brief goals
- **Critical For**: Ensuring user needs drive technical decisions

### 3. System Patterns (systemPatterns.md)
- **Purpose**: Establishes system architecture and component relationships
- **When to Use**: During system design and when making integration decisions
- **Workflow Step**: Third document, translates product needs to technical design
- **Critical For**: Maintaining a coherent and scalable technical architecture

### 4. Tech Context (techContext.md)
- **Purpose**: Specifies technology stack and implementation details
- **When to Use**: During development and when onboarding technical team members
- **Workflow Step**: Fourth document, makes concrete technology choices
- **Critical For**: Technical consistency and efficient development

### 5. Active Context (activeContext.md)
- **Purpose**: Tracks current tasks, open issues, and development focus
- **When to Use**: Daily, during planning sessions, and when switching tasks
- **Workflow Step**: Fifth document, operationalizes the technical approach
- **Critical For**: Day-to-day execution and short-term planning

### 6. Progress (progress.md)
- **Purpose**: Documents completed work, milestones, and project history
- **When to Use**: After completing significant work or during reviews
- **Workflow Step**: Ongoing document that records the project journey
- **Critical For**: Tracking accomplishments and learning from experience

## Standard Workflows

### Documentation Sequence
Always follow this sequence for document creation and reference:
1. **Project Brief** → Foundation of all project decisions
2. **Product Context** → User-focused requirements and features
3. **System Patterns** → Architecture and component design
4. **Tech Context** → Technology choices and implementation guidelines
5. **Active Context** → Current work and immediate focus
6. **Progress** → Historical record and milestone tracking

### Document Lifecycle Management
Each document follows a standard lifecycle:
1. **Creation**: Establish initial content based on project needs
2. **Reference**: Use document for planning and decision-making
3. **Update**: Revise when relevant factors change
4. **Review**: Periodically validate for accuracy and completeness
5. **Archive**: Maintain as historical reference when superseded

## Best Practices

### Document Quality Standards
- **Clarity**: Write in clear, concise language
- **Completeness**: Include all relevant information
- **Consistency**: Use consistent terminology across documents
- **Structure**: Follow standardized document formats
- **Granularity**: Balance detail with readability
- **Traceability**: Link related concepts across documents

### Document Integration Principles
- **Vertical Traceability**: Ensure business goals trace to technical implementation
- **Horizontal Consistency**: Maintain alignment across documents at the same level
- **Change Impact Analysis**: Update related documents when one changes
- **Decision Recording**: Document the reasoning behind significant decisions
`;

    // Try to find existing .byterules template
    const possiblePaths = [
      path.join(__dirname, 'src', 'templates', '.byterules'),
      path.join(__dirname, 'templates', '.byterules'),
    ];
    
    let bytesRulesFound = false;
    for (const testPath of possiblePaths) {
      if (await fs.pathExists(testPath)) {
        console.log(`Found .byterules at: ${testPath}`);
        await fs.copy(testPath, byterulesDest);
        bytesRulesFound = true;
        break;
      }
    }
    
    if (!bytesRulesFound) {
      console.log('Creating default .byterules file');
      await fs.writeFile(byterulesDest, defaultByterules, 'utf-8');
    }
    
    // Create the memory bank structure
    await createMemoryBankStructure(memoryBankDir);
    
    // Generate document contents
    console.log('Generating document contents...');
    const documentContents = await generateAllDocuments(goal);
    
    // Save each document
    for (const [docType, content] of Object.entries(documentContents)) {
      const filePath = path.join(memoryBankDir, `${docType}.md`);
      console.log(`Saving ${docType}.md...`);
      await saveDocument(content, filePath);
    }
    
    return {
      success: true,
      location: memoryBankDir,
      message: `✅ Memory Bank successfully created!\n\nLocation: ${memoryBankDir}\n\nGenerated Documents:\n- projectbrief.md\n- productContext.md\n- systemPatterns.md\n- techContext.md\n- activeContext.md\n- progress.md\n- .byterules`
    };
  } catch (error) {
    console.error('Error creating Memory Bank:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Test the initialization
async function testInitialization() {
  const goal = 'HomiQR is a comprehensive smart building management system that provides QR-based access control, visitor management, resident services, and administrative oversight through multiple applications (admin panel, resident mobile app, and visitor web app)';
  const location = 'C:/Users/Haydar/Desktop/denemeapp/homiqr';
  
  try {
    const result = await initializeMemoryBankDirectly(goal, location);
    console.log('Initialization result:', result);
  } catch (error) {
    console.error('Test initialization error:', error);
  }
}

testInitialization();

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ CRITICAL: Project Rules Reference

**MUST READ FIRST**: Before making any code changes or suggestions, always reference the comprehensive project rules in:
`@.cursor/rules/project-rules.mdc`

This file contains essential development principles, coding standards, TDD strategies, and architectural guidelines that MUST be followed throughout the project.

## 📋 MANDATORY: Project Progress Management

**REQUIRED FOR ALL WORK**: When working on this project, you MUST:

1. **Reference Requirements**: Always check `@docs/requirements.md` to understand project specifications and constraints
2. **Follow Design Guidelines**: Review `@docs/design.md` for architectural patterns and implementation strategies
3. **Track Progress**: Use `@docs/checklist.md` to:
   - Check current project status and completed items
   - Follow the defined implementation sequence
   - Update checklist items as you complete tasks
   - Ensure no steps are skipped in the development workflow
4. **Commit After Each Stage**: When a checklist item or stage is completed:
   - Mark the item as completed `[x]` in `@docs/checklist.md`
   - Create a git commit with the message specified in the checklist
   - Use the exact commit message format provided (e.g., "**커밋**: \"message\"")

**⚠️ Critical**: The checklist follows a specific order (1단계 → 10단계) that must be respected. Each stage builds on the previous one, especially the TDD approach for core business logic.

## Project Overview

This is a TODO Web Application built with modern web technologies in a monorepo structure. The frontend uses React + Mantine UI, and the backend is designed for AWS serverless architecture. The project follows TDD principles for backend development and has a comprehensive test strategy.

## Development Commands

### Root Level (Monorepo)
```bash
# Development
npm run dev          # Start frontend dev server
npm run build        # Build frontend
npm run test         # Run frontend tests
npm run lint         # Lint frontend code
npm run format       # Format frontend code

# Setup
npm install          # Install all workspace dependencies
npm run prepare      # Setup Husky git hooks
```

### Frontend Commands
```bash
cd frontend

# Development
npm run dev          # Start Vite dev server
npm run build        # TypeScript compile + Vite build
npm run preview      # Preview built application

# Code Quality
npm run lint         # ESLint check
npm run lint:fix     # ESLint fix
npm run format       # Prettier format
npm run format:check # Prettier check

# Testing
npm run test         # Vitest (watch mode)
npm run test:ui      # Vitest UI
npm run test:coverage # Coverage report
```

## Architecture Overview

### State Management
- **React Context + useReducer** for global Todo state management
- **Context Location**: `frontend/src/contexts/TodoContext.tsx`
- **Reducer Logic**: `frontend/src/contexts/TodoReducer.ts`
- **Actions**: `frontend/src/contexts/TodoAction.ts`

### Storage Strategy Pattern
- **Dual Storage Strategy**: Local storage and API storage
- **Storage Manager**: `frontend/src/services/StorageManager.ts`
- **Local Implementation**: `frontend/src/services/LocalStorageService.ts`
- **API Implementation**: `frontend/src/services/ApiStorageService.ts`
- **Interface**: `frontend/src/services/StorageService.ts`

### Component Architecture
- **Layout Components**: `frontend/src/components/layout/` (Header, Footer, Layout)
- **Todo Components**: `frontend/src/components/todo/` (TodoForm, TodoItem, TodoList, TodoFilter, TodoStats)
- **Common Components**: `frontend/src/components/common/` (ErrorBoundary, ErrorTest components)
- **Pages**: `frontend/src/pages/` (TodoPage, SettingsPage, TestPage, NotFoundPage)

### Custom Hooks
- **useTodoState**: `frontend/src/hooks/useTodoState.ts` - State management
- **useTodoActions**: `frontend/src/hooks/useTodoActions.ts` - Action dispatchers
- **useTodoFilter**: `frontend/src/hooks/useTodoFilter.ts` - Filtering logic

### Type System
- **Core Types**: `frontend/src/types/index.ts` (Todo, Priority, TodoStatus interfaces)
- **Validation**: `frontend/src/types/validation.ts`
- **Models**: `frontend/src/models/Todo.ts` with business logic

## Code Quality & Git Hooks

### Pre-commit Hook (Automated)
Location: `.husky/pre-commit`
- **Smart Detection**: Only runs when frontend files are staged
- **Auto-execution Order**:
  1. ESLint fix (`npm run lint:fix`)
  2. TypeScript compile + build (`npm run build`)
  3. Test suite (`npm run test -- --run`)
- **Fail-safe**: Commit blocked if any step fails

### Testing Strategy
- **Frontend**: TDD for core business logic, implementation-first for UI
- **Backend**: Full TDD approach (planned)
- **Test Framework**: Vitest with React Testing Library
- **Coverage**: Required for core functionality

## Technology Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for development and building
- **Mantine UI** component library
- **React Router** for routing
- **Vitest** for testing
- **ESLint + Prettier** for code quality

### Development Tools
- **Husky** for Git hooks
- **Node.js 18+** required
- **npm workspaces** for monorepo management

## Key File Locations

- **Main App**: `frontend/src/App.tsx`
- **Entry Point**: `frontend/src/main.tsx`
- **Type Definitions**: `frontend/src/types/index.ts`
- **Context Setup**: `frontend/src/contexts/TodoContext.tsx`
- **Storage Logic**: `frontend/src/services/StorageManager.ts`
- **Custom Hooks**: `frontend/src/hooks/`
- **Tests**: `frontend/src/**/__tests__/`

## Development Workflow

1. **Install Dependencies**: `npm install` (root level)
2. **Start Development**: `npm run dev` (starts frontend dev server)
3. **Run Tests**: `npm run test` (in frontend directory)
4. **Code Quality**: Automatically handled by pre-commit hooks
5. **Build**: `npm run build` (TypeScript + Vite build)

## SuperClaude Framework Integration

### Command Recommendations

When working on this project, use appropriate SuperClaude commands for optimal workflow:

```bash
# Session Management
/sc:load .              # Load project context at session start
/sc:save               # Save session state regularly (every 30min)

# Analysis & Planning
/sc:analyze --focus [architecture|performance|security|quality]
/sc:brainstorm "[feature description]"
/sc:workflow "[task description]" --format checklist

# Implementation
/sc:implement "[feature]" --tdd              # For TDD approach
/sc:implement "[ui component]" --magic       # For UI components
/sc:design "[system/feature]" --focus [frontend|backend]

# Testing & Quality
/sc:test --type [unit|integration|e2e] --coverage
/sc:improve --focus [performance|quality|accessibility]
/sc:troubleshoot "[issue description]" --type [runtime|build]

# Build & Deploy
/sc:build "[target]" --type [frontend|backend|infrastructure]
```

### Expert Agents for Project Domains

Use specialized agents for domain-specific guidance:

```bash
# Frontend Development
@agent-frontend-architect    # React/Mantine UI architecture
@agent-performance-engineer  # Performance optimization

# Quality & Testing
@agent-quality-engineer      # TDD strategy and test patterns
@agent-refactoring-expert   # Code quality improvement

# Backend Development (for stages 7-8)
@agent-backend-architect    # AWS serverless architecture
@agent-security-engineer    # Security best practices

# DevOps (for stages 9-10)
@agent-devops-architect     # CI/CD and infrastructure
```

### MCP Server Usage

Leverage MCP servers for enhanced capabilities:

- **serena** 🧭: Project memory and semantic code understanding
- **context7** 📚: Official React/Vite/Mantine documentation
- **magic** ✨: Modern UI component generation
- **playwright** 🎭: E2E testing and accessibility validation
- **sequential-thinking** 🧠: Complex problem analysis

### Workflow Integration Examples

For comprehensive guidance on using SuperClaude commands in this project:

- **General Guidelines**: See `/Users/freelife/vive/study/handson-vivecoding-demo/docs/Guideline.md`
- **Project-Specific Workflows**: See `/Users/freelife/vive/study/handson-vivecoding-demo/docs/SuperClaude_Project_Guideline.md`

These documents provide detailed command combinations, workflow patterns, and stage-specific SuperClaude strategies for optimal development experience.

## Important Notes

- Always update `docs/checklist.md` before committing
- Pre-commit hooks automatically run lint fix, build, and tests
- Use TypeScript for all new code
- Follow TDD for core business logic
- Component naming: PascalCase, functions/variables: camelCase
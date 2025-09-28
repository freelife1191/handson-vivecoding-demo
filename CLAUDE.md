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

## Sub Agents Integration

### Intelligent Task Routing

When receiving requests, Claude Code should automatically delegate to appropriate specialized agents based on the request type and complexity.

### Available Sub Agents

#### Core Development Agents
- **general-purpose**: Complex multi-step tasks, research, code search
- **python-expert**: Production-ready Python code following SOLID principles
- **frontend-architect**: Accessible, performant UI with modern frameworks
- **backend-architect**: Reliable backend systems with data integrity focus
- **system-architect**: Scalable system architecture and technical decisions

#### Quality & Analysis Agents
- **refactoring-expert**: Code quality improvement and technical debt reduction
- **performance-engineer**: System performance optimization and bottleneck elimination
- **security-engineer**: Security vulnerability identification and compliance
- **quality-engineer**: Comprehensive testing strategies and edge case detection
- **root-cause-analyst**: Complex problem investigation and diagnosis

#### Specialized Workflow Agents
- **requirements-analyst**: Transform ambiguous ideas into concrete specifications
- **technical-writer**: Clear, comprehensive technical documentation
- **learning-guide**: Programming education with progressive learning
- **socratic-mentor**: Educational guidance using Socratic method

### Task-Agent Mapping

#### Frontend Development Tasks
```
"Create React component" → frontend-architect
"Optimize rendering performance" → performance-engineer
"Add accessibility features" → frontend-architect
"Refactor component structure" → refactoring-expert
```

#### Backend Development Tasks
```
"Design API architecture" → backend-architect
"Implement authentication" → security-engineer + backend-architect
"Optimize database queries" → performance-engineer
"Design microservices" → system-architect
```

#### Code Quality Tasks
```
"Fix code smells" → refactoring-expert
"Improve test coverage" → quality-engineer
"Debug performance issue" → root-cause-analyst + performance-engineer
"Security audit" → security-engineer
```

#### Analysis & Documentation Tasks
```
"Analyze system architecture" → system-architect
"Write technical documentation" → technical-writer
"Explain complex concepts" → learning-guide
"Requirements gathering" → requirements-analyst
```

### Delegation Triggers

#### Automatic Delegation (No user prompt needed)
- **Complex multi-step tasks** (>3 steps) → general-purpose
- **Performance issues** → performance-engineer
- **Security concerns** → security-engineer
- **Code quality problems** → refactoring-expert
- **Architecture decisions** → system-architect or frontend-architect

#### Request Pattern Recognition
```
"How to..." → learning-guide or socratic-mentor
"Optimize..." → performance-engineer
"Secure..." → security-engineer
"Debug..." → root-cause-analyst
"Refactor..." → refactoring-expert
"Design..." → system-architect or frontend-architect
"Test..." → quality-engineer
"Document..." → technical-writer
```

### Agent Coordination Strategies

#### Sequential Processing
For tasks requiring multiple expertise areas:
1. **Analysis Phase**: root-cause-analyst or system-architect
2. **Implementation Phase**: Appropriate specialist (frontend/backend/python-expert)
3. **Quality Phase**: quality-engineer or refactoring-expert
4. **Security Review**: security-engineer (if applicable)

#### Parallel Processing
For independent subtasks:
- Multiple agents working on different components simultaneously
- Results aggregated and coordinated by primary agent

### Project-Specific Agent Usage

#### Todo App Frontend (Current Phase)
- **Primary**: frontend-architect (React + Mantine UI)
- **Secondary**: quality-engineer (TDD implementation)
- **Support**: refactoring-expert (code organization)

#### Backend Development (Future Phases)
- **Primary**: backend-architect (AWS serverless)
- **Secondary**: security-engineer (authentication/authorization)
- **Support**: performance-engineer (optimization)

#### Testing & Quality Assurance
- **Primary**: quality-engineer (comprehensive testing)
- **Secondary**: performance-engineer (performance testing)
- **Support**: security-engineer (security testing)

### Best Practices for Agent Utilization

1. **Clear Context**: Always provide full project context to agents
2. **Specific Requirements**: Include technical constraints and requirements
3. **Quality Standards**: Reference project rules and coding standards
4. **Progress Tracking**: Use TodoWrite for multi-agent coordination
5. **Result Validation**: Verify agent outputs against project standards

## Important Notes

- Always update `docs/checklist.md` before committing
- Pre-commit hooks automatically run lint fix, build, and tests
- Use TypeScript for all new code
- Follow TDD for core business logic
- Component naming: PascalCase, functions/variables: camelCase
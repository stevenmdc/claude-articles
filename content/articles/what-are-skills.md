---
title: "What are Skills?"
subtitle: "Updated this week"
description: "An overview of Skills, how they work, the different types, key benefits, and how they compare to other Claude capabilities."
date: "2026-02-09"
chapters:
  - id: "what-are-skills"
    number: "01"
    title: "What are Skills?"
  - id: "how-skills-work"
    number: "02"
    title: "How do Skills work?"
  - id: "types-of-skills"
    number: "03"
    title: "Types of Skills"
  - id: "key-benefits"
    number: "04"
    title: "Key Benefits"
  - id: "agent-skills-open-standard"
    number: "05"
    title: "Agent Skills Open Standard"
  - id: "comparisons"
    number: "06"
    title: "Comparing Skills to other Claude capabilities"
---

## What are Skills? {#what-are-skills}

Skills are available for users on free, Pro, Max, Team, and Enterprise plans. This feature requires code execution to be enabled. Skills are also available in beta for Claude Code users and for all API users using the code execution tool.

Skills are folders of instructions, scripts, and resources that Claude loads dynamically to improve performance on specialized tasks. Skills teach Claude how to complete specific tasks in a repeatable way, whether that is creating documents with your company’s brand guidelines, analyzing data using your organization’s specific workflows, or automating personal tasks.

## How do Skills work? {#how-skills-work}

Skills improve Claude's consistency, speed, and performance on many tasks. Skills work through progressive disclosure: Claude determines which Skills are relevant and loads the information it needs to complete that task, helping to prevent context window overload.

When you ask Claude to complete a task, it reviews available Skills, loads relevant ones, and applies their instructions.

## Types of Skills {#types-of-skills}

### Anthropic Skills

These are Skills created and maintained by Anthropic, such as enhanced document creation for Excel, Word, PowerPoint, and PDF files. Anthropic Skills are available to all users and Claude invokes them automatically when relevant.

### Custom Skills

These are Skills you or your organization create for specialized workflows and domain-specific tasks. Here are some potential workflows you could enable using custom Skills:

- Apply brand style guidelines to documents and presentations.
- Generate communications following company email templates.
- Structure meeting notes with company-specific formats.
- Create tasks in company tools (JIRA, Asana, Linear) following team conventions.
- Execute company-specific data analysis workflows.
- Automate personal workflows and customize Claude to match your work style.

### Organization provisioned skills

For Team and Enterprise plans, organization Owners can provision skills for all users. Skills provisioned in this way appear automatically in every team member's Skills list and can be set as enabled or disabled by default. This allows organizations to:

- Distribute approved workflows consistently across all employees.
- Ensure teams use standardized procedures and best practices.
- Deploy new capabilities without requiring individual uploads.

Learn more about provisioning skills in Provisioning and managing Skills for your organization.

### Partner skills

The Skills Directory features professionally built skills from partners like Notion, Figma, Atlassian, and others. These skills are designed to work seamlessly with their respective MCP connectors, enabling powerful integrated workflows.

## Key Benefits {#key-benefits}

- Improvement in Claude's performance of specific tasks: Skills provide specialized capabilities for tasks like document creation, data analysis, and domain-specific work that requires supplementing Claude's general knowledge.
- Organizational knowledge capture: Package your company's workflows, best practices, and institutional knowledge for Claude to use consistently across your team.
- Easy customization: Anyone can create Skills by writing instructions in Markdown. No coding is required for simple Skills, though you can attach executable scripts to custom Skills for more advanced functionality.
- Centralized management for organizations: Team and Enterprise plan Owners can provision skills organization wide, ensuring consistent workflows across teams without requiring individual setup from each user.

## Agent Skills Open Standard {#agent-skills-open-standard}

The Agent Skills specification is published as an open standard at agentskills.io. This means skills you create are not locked to Claude: the same skill format works across AI platforms and tools that adopt the standard. A reference Python SDK is also available for developers implementing skills support in their own platforms.

## Comparing Skills to other Claude capabilities {#comparisons}

### Skills vs. Projects

Projects provide static background knowledge that is always loaded when you start chats within them. Skills provide specialized procedures that activate dynamically when needed and work everywhere across Claude.

### Skills vs. MCP (Model Context Protocol)

MCP connects Claude to external services and data sources. Skills provide procedural knowledge: instructions for how to complete specific tasks or workflows. You can use both together: MCP connections give Claude access to tools, while Skills teach Claude how to use those tools effectively.

### Skills vs. Custom Instructions

Custom instructions apply broadly to all your conversations. Skills are task specific and only load when relevant, making them better for specialized workflows.

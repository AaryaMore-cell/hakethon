import { NextRequest, NextResponse } from 'next/server'

interface WorkflowItem {
  id: string
  title: string
  trigger: string
  actions: string[]
  status: 'active' | 'paused' | 'executing'
  lastRun: string
  totalRuns: number
  successRate: string
}

let workflowsStore: WorkflowItem[] = [
  {
    id: 'wf-1',
    title: 'Legal Contract Risk & Indemnity Triage',
    trigger: 'When any PDF uploaded to /legal-review folder',
    actions: [
      'Extract liability, governing law, and indemnification caps',
      'Cross-reference with standard Enterprise MSA baseline',
      'Post executive risk brief to Slack #legal-escalations'
    ],
    status: 'active',
    lastRun: '14 minutes ago',
    totalRuns: 284,
    successRate: '99.6%'
  },
  {
    id: 'wf-2',
    title: 'SOC2 & HIPAA Continuous Control Sync',
    trigger: 'Every 24 hours at 00:00 UTC',
    actions: [
      'Poll AWS IAM key age and rotation telemetry',
      'Verify encryption-at-rest flags on all Supabase databases',
      'Update compliance matrix in Audit Center'
    ],
    status: 'active',
    lastRun: '2 hours ago',
    totalRuns: 1420,
    successRate: '100%'
  },
  {
    id: 'wf-3',
    title: 'Executive Meeting Action Items to Jira',
    trigger: 'On meeting transcript ingestion from Google Meet',
    actions: [
      'Extract action owners, estimated story points, and deadlines',
      'Create sprint sub-tasks under active Jira Epic',
      'Send confirmation DM to meeting host with checklist'
    ],
    status: 'active',
    lastRun: 'Yesterday at 05:15 PM',
    totalRuns: 618,
    successRate: '98.9%'
  },
  {
    id: 'wf-4',
    title: 'Cross-Team Dependency Blocker Radar',
    trigger: 'When pull request touches API schema definitions',
    actions: [
      'Traverse Knowledge Graph for downstream consumers',
      'Flag potential breaking changes to Frontend & Mobile leads',
      'Request review from Architecture Guild'
    ],
    status: 'active',
    lastRun: '3 hours ago',
    totalRuns: 512,
    successRate: '99.2%'
  }
]

export async function GET() {
  return NextResponse.json({
    success: true,
    count: workflowsStore.length,
    workflows: workflowsStore
  })
}

export async function POST(request: NextRequest) {
  try {
    const { action, workflowId, newWorkflow } = await request.json()

    // 1. Trigger an existing workflow run
    if (action === 'trigger' && workflowId) {
      const wf = workflowsStore.find(w => w.id === workflowId)
      if (!wf) {
        return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
      }

      wf.lastRun = 'Just now'
      wf.totalRuns += 1

      const executionLog = {
        executionId: `exec-${Date.now().toString(36)}`,
        workflowId: wf.id,
        title: wf.title,
        status: 'completed',
        completedAt: new Date().toISOString(),
        stepsExecuted: wf.actions.map((act, idx) => ({
          step: idx + 1,
          action: act,
          status: 'success',
          durationMs: Math.floor(Math.random() * 200) + 120
        }))
      }

      return NextResponse.json({
        success: true,
        message: `Workflow "${wf.title}" executed successfully`,
        log: executionLog
      })
    }

    // 2. Register a new custom workflow
    if (newWorkflow && newWorkflow.title) {
      const created: WorkflowItem = {
        id: `wf-${Date.now().toString(36)}`,
        title: newWorkflow.title,
        trigger: newWorkflow.trigger || 'Manual trigger',
        actions: newWorkflow.actions || ['Extract metadata', 'Notify team'],
        status: 'active',
        lastRun: 'Never',
        totalRuns: 0,
        successRate: '100%'
      }
      workflowsStore = [created, ...workflowsStore]

      return NextResponse.json({
        success: true,
        message: 'New autonomous workflow created',
        workflow: created
      }, { status: 201 })
    }

    return NextResponse.json({ error: 'Invalid workflow operation' }, { status: 400 })
  } catch (error: unknown) {
    console.error('Workflow API error:', error)
    return NextResponse.json({ error: 'Failed to process workflow operation' }, { status: 500 })
  }
}

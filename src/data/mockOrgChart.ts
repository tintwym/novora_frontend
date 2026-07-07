import type { OrgChartNode } from '../types/orgChart'

export function mockOrgChartRoot(): OrgChartNode {
  return {
    id: 'ceo',
    name: 'Ahmad Wahid',
    role: 'Chief Executive Officer · CEO',
    initials: 'AW',
    deptKey: 'ceo',
    deptLabel: 'Executive',
    children: [
      {
        id: 'eng-head',
        name: 'David Ng',
        role: 'Head of Eng.',
        initials: 'DN',
        deptKey: 'engineering',
        deptLabel: 'Engineering',
        memberCount: 342,
        children: [
          {
            id: 'sarah',
            name: 'Sarah Lim',
            role: 'Sr. Developer',
            initials: 'SL',
            deptKey: 'engineering',
            deptLabel: 'Engineering',
            moreCount: 8,
            children: [
              { id: 'hana', name: 'Hana', role: 'Dev', initials: 'H', deptKey: 'engineering', deptLabel: 'Engineering', children: [] },
              { id: 'zul', name: 'Zali M', role: 'Dev', initials: 'ZM', deptKey: 'engineering', deptLabel: 'Engineering', children: [] },
            ],
          },
          { id: 'raj', name: 'Raj', role: 'Tech Lead', initials: 'R', deptKey: 'engineering', deptLabel: 'Engineering', moreCount: 12, children: [
              { id: 'irfan', name: 'Irfan M', role: 'Backend Dev', initials: 'IM', deptKey: 'engineering', deptLabel: 'Engineering', children: [] },
            ] },
        ],
      },
      {
        id: 'cfo',
        name: 'Rachel Tan',
        role: 'CFO',
        initials: 'RT',
        deptKey: 'finance',
        deptLabel: 'Finance',
        memberCount: 180,
        children: [
          { id: 'fa1', name: 'Wei Chen', role: 'Financial Analyst', initials: 'WC', deptKey: 'finance', deptLabel: 'Finance', children: [] },
          { id: 'fa2', name: 'Priya Nair', role: 'Controller', initials: 'PN', deptKey: 'finance', deptLabel: 'Finance', children: [] },
        ],
      },
      {
        id: 'hr-head',
        name: 'Nina Reza',
        role: 'Head of HR',
        initials: 'NR',
        deptKey: 'hr',
        deptLabel: 'HR',
        memberCount: 88,
        children: [
          { id: 'bp1', name: 'Alex Wong', role: 'HR Partner', initials: 'AW', deptKey: 'hr', deptLabel: 'HR', children: [] },
        ],
      },
      {
        id: 'cmo',
        name: 'Kevin Lim',
        role: 'CMO',
        initials: 'KL',
        deptKey: 'marketing',
        deptLabel: 'Marketing',
        memberCount: 142,
        children: [
          { id: 'm1', name: 'Siti Aminah', role: 'Brand Lead', initials: 'SA', deptKey: 'marketing', deptLabel: 'Marketing', children: [] },
        ],
      },
      {
        id: 'coo',
        name: 'Malik Said',
        role: 'COO',
        initials: 'MS',
        deptKey: 'operations',
        deptLabel: 'Operations',
        memberCount: 261,
        children: [
          { id: 'op1', name: 'Jonas Lee', role: 'Ops Manager', initials: 'JL', deptKey: 'operations', deptLabel: 'Operations', children: [] },
        ],
      },
    ],
  }
}

export function flattenOrgChart(root: OrgChartNode): OrgChartNode[] {
  const out: OrgChartNode[] = []

  function visit(node: OrgChartNode, reportsTo: string | null) {
    if (!node.isOpenPosition) {
      out.push({
        ...node,
        reportsToName: reportsTo ?? undefined,
        children: [],
      })
    }
    for (const child of node.children ?? []) {
      visit(child, node.isOpenPosition ? reportsTo : node.name)
    }
  }

  visit(root, null)
  return out
}

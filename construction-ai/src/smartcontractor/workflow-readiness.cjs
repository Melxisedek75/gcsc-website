function buildSmartContractorWorkflowReadiness() {
  const workflowSteps = [
    {
      id: 'homeowner_project_request',
      label: 'Homeowner project request',
      owner_view: 'Homeowner creates a local project request with trade, location, budget, and scope notes.',
      product_value: 'Starts the Construction Trust Infrastructure record without publishing a real lead or binding contract.',
      required_api_routes: [
        '/api/smartcontractor/jobs',
        '/api/smartcontractor/homeowners',
      ],
      required_ui_surfaces: [
        'Homeowner project form',
        'Demo Run Order',
        'Demo Safety Boundary Strip',
      ],
      live_action_status: 'BLOCKED_FOR_LIVE',
      blocked_live_actions: [
        'publish_real_lead',
        'bind_homeowner',
        'start_escrow',
      ],
    },
    {
      id: 'contractor_bid_review',
      label: 'Contractor bid review',
      owner_view: 'Contractor reviews a local project request and submits a demo bid with timeline and amount.',
      product_value: 'Creates comparable contractor records without creating a real commitment or license verification decision.',
      required_api_routes: [
        '/api/smartcontractor/bids',
        '/api/smartcontractor/contractors',
      ],
      required_ui_surfaces: [
        'Contractor bid form',
        'Contractor verification status',
      ],
      live_action_status: 'BLOCKED_FOR_LIVE',
      blocked_live_actions: [
        'verify_license_final',
        'guarantee_price',
        'bind_contractor',
      ],
    },
    {
      id: 'project_contract_record',
      label: 'Project contract record',
      owner_view: 'Admin or homeowner drafts a local project contract record from a selected bid.',
      product_value: 'Turns project scope into an auditable construction record before licensed escrow or lending partners are involved.',
      required_api_routes: [
        '/api/smartcontractor/project-contracts',
      ],
      required_ui_surfaces: [
        'Project contract status',
        'Admin review queue',
      ],
      live_action_status: 'BLOCKED_FOR_LIVE',
      blocked_live_actions: [
        'execute_signature',
        'create_legal_contract',
        'activate_provider_terms',
      ],
    },
    {
      id: 'escrow_ready_milestones',
      label: 'Escrow-ready milestones',
      owner_view: 'Project milestones record visible work progress, amount, work status, and payment status.',
      product_value: 'Prepares milestone evidence for future licensed escrow review without holding or releasing funds.',
      required_api_routes: [
        '/api/smartcontractor/milestones',
        '/api/payments/intents',
      ],
      required_ui_surfaces: [
        'Milestone tracker',
        'Payment Router demo-only warning',
      ],
      live_action_status: 'BLOCKED_FOR_LIVE',
      blocked_live_actions: [
        'hold_escrow',
        'release_escrow',
        'move_payment',
      ],
    },
    {
      id: 'partner_reviewed_working_capital',
      label: 'Partner-reviewed working capital',
      owner_view: 'Contractor working-capital request stays a local review record with repayment waterfall context.',
      product_value: 'Shows how verified project data can support future lender review without GCSC approving or funding a loan.',
      required_api_routes: [
        '/api/smartcontractor/loans',
        '/api/admin/contract-backed-loan/repayment-waterfall/review-packet',
      ],
      required_ui_surfaces: [
        'Loan request demo-only warning',
        'Repayment waterfall review packet',
      ],
      live_action_status: 'BLOCKED_FOR_LIVE',
      blocked_live_actions: [
        'approve_real_loan',
        'fund_contractor',
        'route_real_repayment',
      ],
    },
    {
      id: 'dispute_evidence_packet',
      label: 'Dispute evidence packet',
      owner_view: 'Homeowner, contractor, or reviewer records local dispute notes, evidence, and peer-review recommendations.',
      product_value: 'Builds a structured dispute packet without deciding liability, refunds, or legal outcome.',
      required_api_routes: [
        '/api/smartcontractor/disputes',
        '/api/smartcontractor/disputes/:disputeId/evidence',
        '/api/smartcontractor/disputes/:disputeId/reviews',
      ],
      required_ui_surfaces: [
        'Dispute Center demo-only warning',
        'Peer review panel',
      ],
      live_action_status: 'BLOCKED_FOR_LIVE',
      blocked_live_actions: [
        'decide_legal_liability',
        'issue_refund',
        'override_escrow',
      ],
    },
    {
      id: 'admin_founder_review',
      label: 'Admin and founder review',
      owner_view: 'Admin workspace shows readiness, request IDs, founder gates, smart contract demo gates, and blocked live actions.',
      product_value: 'Gives the founder a control plane for deciding what is ready for beta, legal/provider review, or future build work.',
      required_api_routes: [
        '/api/admin/beta-readiness',
        '/api/admin/ai-agents/workflows',
        '/api/admin/smartcontractor-workflow-readiness',
      ],
      required_ui_surfaces: [
        'Admin Console demo-only warning',
        'Founder Gate Snapshot',
        'Smart Contract Demo Gate',
      ],
      live_action_status: 'BLOCKED_FOR_LIVE',
      blocked_live_actions: [
        'change_live_rls',
        'assign_live_admin_role',
        'approve_production_release',
      ],
    },
  ];

  const reviewCheckpoints = [
    {
      id: 'milestone_evidence_ready',
      label: 'Milestone evidence readiness',
      status: 'REVIEW_REQUIRED',
      owner: 'Founder/Admin',
      purpose: 'Confirm milestone scope, visible progress, amount, work status, payment status, and local evidence metadata before any escrow-provider review.',
      next_review_action: 'Collect current milestone photo or note metadata and compare it against the project contract before escrow-provider review.',
      blocked_until: 'founder_admin_review',
      review_packet_target: 'escrow_provider_review_packet',
      required_evidence: [
        'project_contract_record',
        'milestone_sequence_and_amount',
        'milestone_photo_or_note_metadata',
        'payment_status_local_only',
      ],
      blocked_live_actions: [
        'hold_escrow',
        'release_escrow',
        'move_payment',
      ],
    },
    {
      id: 'working_capital_review_ready',
      label: 'Working-capital review readiness',
      status: 'REVIEW_REQUIRED',
      owner: 'Founder/Admin + lender/provider reviewer',
      purpose: 'Confirm contractor identity, project contract, milestone context, risk score, and repayment waterfall before any lender/provider package is trusted.',
      next_review_action: 'Compare contractor identity, milestone context, risk score, and repayment waterfall before lender/provider review.',
      blocked_until: 'lender_provider_review',
      review_packet_target: 'working_capital_provider_review_packet',
      required_evidence: [
        'contractor_business_identity',
        'project_contract_record',
        'milestone_context',
        'repayment_waterfall_review_packet',
      ],
      blocked_live_actions: [
        'approve_real_loan',
        'fund_contractor',
        'route_real_repayment',
      ],
    },
    {
      id: 'dispute_packet_ready',
      label: 'Dispute packet readiness',
      status: 'REVIEW_REQUIRED',
      owner: 'Founder/Admin + dispute reviewer',
      purpose: 'Confirm dispute notes, evidence metadata, peer-review recommendation, and role context before any external dispute or legal review.',
      next_review_action: 'Package dispute record, evidence metadata, peer-review recommendation, and role context before external dispute or legal review.',
      blocked_until: 'dispute_or_legal_review',
      review_packet_target: 'dispute_evidence_review_packet',
      required_evidence: [
        'dispute_record',
        'evidence_metadata',
        'peer_review_recommendation',
        'opened_by_role_context',
      ],
      blocked_live_actions: [
        'decide_legal_liability',
        'issue_refund',
        'override_escrow',
      ],
    },
    {
      id: 'founder_authority_ready',
      label: 'Founder authority readiness',
      status: 'REVIEW_REQUIRED',
      owner: 'Founder',
      purpose: 'Confirm founder Auth/Admin evidence, admin membership, strict RLS decision, public beta decision, and live-action stop boundaries before any production step.',
      next_review_action: 'Confirm founder Auth/Admin evidence, admin membership, strict RLS, and public beta go/no-go before any production step.',
      blocked_until: 'founder_explicit_approval',
      review_packet_target: 'founder_live_action_decision_packet',
      required_evidence: [
        'founder_auth_admin_smoke_evidence',
        'admin_membership_review',
        'strict_rls_decision_packet',
        'public_beta_go_no_go_record',
      ],
      blocked_live_actions: [
        'assign_live_admin_role',
        'change_live_rls',
        'approve_production_release',
      ],
    },
  ];

  const workflowStepIds = workflowSteps.map((step) => step.id);
  const checkpointIds = reviewCheckpoints.map((checkpoint) => checkpoint.id);
  const checkpointActionQueue = reviewCheckpoints.map((checkpoint, index) => ({
    priority: index + 1,
    checkpoint_id: checkpoint.id,
    label: checkpoint.label,
    owner: checkpoint.owner,
    status: checkpoint.status,
    admin_queue_state: 'READY_FOR_LOCAL_REVIEW',
    live_action_status: 'BLOCKED_FOR_LIVE',
    next_review_action: checkpoint.next_review_action,
    blocked_until: checkpoint.blocked_until,
    review_packet_target: checkpoint.review_packet_target,
    required_evidence_count: checkpoint.required_evidence.length,
    blocked_live_actions: checkpoint.blocked_live_actions,
  }));
  const blockedLiveActions = [...new Set(workflowSteps.flatMap((step) => step.blocked_live_actions))].sort();
  const checkpointBlockedLiveActions = [...new Set(reviewCheckpoints.flatMap((checkpoint) => checkpoint.blocked_live_actions))].sort();
  const checkpointNextActions = [...new Set(reviewCheckpoints.map((checkpoint) => checkpoint.next_review_action))].sort();
  const checkpointReviewPacketTargets = [...new Set(reviewCheckpoints.map((checkpoint) => checkpoint.review_packet_target))].sort();
  const apiRoutes = [...new Set(workflowSteps.flatMap((step) => step.required_api_routes))].sort();
  const uiSurfaces = [...new Set(workflowSteps.flatMap((step) => step.required_ui_surfaces))].sort();

  return {
    status: 'local_demo_ready',
    positioning: 'Construction Trust Infrastructure',
    workflow_steps: workflowSteps,
    review_checkpoints: reviewCheckpoints,
    checkpoint_action_queue: checkpointActionQueue,
    summary: {
      total_steps: workflowSteps.length,
      live_blocked_steps: workflowSteps.filter((step) => step.live_action_status === 'BLOCKED_FOR_LIVE').length,
      api_route_count: apiRoutes.length,
      ui_surface_count: uiSurfaces.length,
      checkpoint_count: reviewCheckpoints.length,
      checkpoint_action_queue_count: checkpointActionQueue.length,
    },
    review_metrics: {
      total_steps: workflowSteps.length,
      blocked_live_step_count: workflowSteps.filter((step) => step.live_action_status === 'BLOCKED_FOR_LIVE').length,
      blocked_live_action_count: blockedLiveActions.length,
      api_route_count: apiRoutes.length,
      ui_surface_count: uiSurfaces.length,
      workflow_step_ids: workflowStepIds,
      checkpoint_count: reviewCheckpoints.length,
      checkpoint_ids: checkpointIds,
      checkpoint_blocked_live_action_count: checkpointBlockedLiveActions.length,
      checkpoint_next_action_count: checkpointNextActions.length,
      checkpoint_review_packet_target_count: checkpointReviewPacketTargets.length,
      checkpoint_action_queue_count: checkpointActionQueue.length,
      checkpoint_action_queue_blocked_count: checkpointActionQueue.filter((item) => item.live_action_status === 'BLOCKED_FOR_LIVE').length,
    },
    demo_only_boundaries: [
      'no_real_payments',
      'no_live_loan_approval',
      'no_escrow_release',
      'no_token_collateral_lock',
      'no_legal_decision',
      'no_provider_commitment',
      'no_production_release',
    ],
    go_no_go: {
      current_state: 'GO_LOCAL_DEMO_ONLY',
      public_beta_state: 'REVIEW_FOUNDER_AUTH_AND_QA',
      real_money_state: 'NO_GO_BLOCKED_FOR_LIVE',
      required_before_public_beta: [
        'Founder Auth/Admin smoke evidence',
        'SmartContractor frontend workflow readiness panel review',
        'No-real-money beta QA pass',
      ],
      blocked_live_actions: [
        'real_payments',
        'live_loan_approval',
        'escrow_release',
        'token_collateral_lock',
      ],
    },
    ui_next_integration: {
      target_panel: 'Admin workflow readiness panel',
      recommended_method: 'GET /api/admin/smartcontractor-workflow-readiness',
      must_preserve: [
        'X-Request-Id',
        'request_id response body',
        'BLOCKED_FOR_LIVE labels',
        'demo-only user-facing language',
      ],
    },
    next_safe_code_tasks: [
      'Use the frontend workflow readiness panel to review milestone, working-capital, dispute, and founder authority gates.',
      'Add frontend checks for workflow step and review checkpoint scan ergonomics.',
      'Keep real payment, loan, escrow, token collateral, provider, and production actions blocked.',
    ],
  };
}

module.exports = {
  buildSmartContractorWorkflowReadiness,
};

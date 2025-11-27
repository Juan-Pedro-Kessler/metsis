export function createMockStripeSdk() {
  return {
    charges: {
      async create(p: any) {
        return {
          id: 'st_' + Math.random().toString(36).slice(2),
          paid: true,
          ...p,
        };
      },
    },
    refunds: {
      async create(p: any) {
        return {
          id: 'strf_' + Math.random().toString(36).slice(2),
          status: 'succeeded',
          ...p,
        };
      },
    },
  };
}

export function createMockMpSdk() {
  return {
    payments: {
      async create(p: any) {
        return {
          id: 'mp_' + Math.random().toString(36).slice(2),
          status: 'approved',
          ...p,
        };
      },
      async refund(id: string, p: any) {
        return {
          id: 'mprf_' + id,
          status: 'approved',
          ...p,
        };
      },
    },
  };
}

export interface XprTransferArgs {
  account: string;
  permission: string;
  recipient: string;
  amount: string;
  memo: string;
}

export interface XprSession<Result> {
  transact(
    request: TransactArgs,
    options?: TransactOptions,
  ): Promise<Result>;
}

export function submitXprTransfer<Result>(
  session: XprSession<Result>,
  args: XprTransferArgs,
): Promise<Result> {
  return session.transact(
    {
      actions: [{
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{ actor: args.account, permission: args.permission }],
        data: {
          from: args.account,
          to: args.recipient,
          quantity: args.amount,
          memo: args.memo,
        },
      }],
    },
    { broadcast: true },
  );
}
import type { TransactArgs, TransactOptions } from '@proton/link';

import { NOT_ALLOWED_TO_ACCESS_API } from '@/lib/retcode';
import { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { fail } from '@/lib/resp';
import { getServerSession } from 'next-auth/next';
import { loginAsTheGodOfTheGods } from '@/lib/backend/perm';

// TODO: 因为没找到配置性的方案的相关资料，所以最终还是用这种需要硬编码的方案
export function isAuthorized() {
  return async (req: NextApiRequest, res: NextApiResponse, next: () => any) => {
    const url = req.url || '';
    const session = await getServerSession(req, res, authOptions);
    if (loginAsTheGodOfTheGods(session)) {
      return next();
    }
    return res.status(403).json(fail(NOT_ALLOWED_TO_ACCESS_API(url)));
  };
}

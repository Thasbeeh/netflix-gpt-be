type TokenType = 'access' | 'refresh';

type JwtPayloadType = {
  sub: number;
  email: string;
  type: TokenType;
};

export default JwtPayloadType;

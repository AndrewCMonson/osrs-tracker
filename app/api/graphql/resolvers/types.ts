/**
 * GraphQL Type Resolvers
 */


export const typeResolvers = {
  DateTime: {
    serialize: (value: Date) => value.toISOString(),
    parseValue: (value: string) => new Date(value),
    parseLiteral: (ast: any) => {
      if (ast.kind === 'StringValue') {
        return new Date(ast.value);
      }
      return null;
    },
  },

  BigInt: {
    serialize: (value: bigint | number) => {
      if (typeof value === 'bigint') {
        return value.toString();
      }
      return String(value);
    },
    parseValue: (value: string | number) => {
      if (typeof value === 'string') {
        return BigInt(value);
      }
      return BigInt(value);
    },
    parseLiteral: (ast: any) => {
      if (ast.kind === 'IntValue' || ast.kind === 'StringValue') {
        return BigInt(ast.value);
      }
      return null;
    },
  },
};


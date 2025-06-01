import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode, GraphQLError } from 'graphql';

@Scalar('DateTime', (type) => Date)
export class DateTimeScalar implements CustomScalar<number, Date> {
  description = 'Date custom scalar. Serializes to a Unix timestamp (milliseconds).';

  /**
   * Called when a Date object from your resolver needs to be sent to the client.
   * @param value The `Date` object from your code.
   * @returns A `number` (Unix timestamp) for the JSON response.
   */
  serialize(value: Date): number {
    return value.getTime();
  }

  /**
   * Called when a number from the client's GraphQL variables needs to be used by your resolver.
   * @param value The `number` from the client.
   * @returns A `Date` object for your service/resolver logic.
   */
  parseValue(value: number): Date {
    return new Date(value);
  }

  /**
   * Called when a value is hard-coded into the query string itself (an AST literal).
   * This is where the type error was.
   * @param ast The abstract syntax tree node.
   * @returns A `Date` object for your service/resolver logic.
   */
  parseLiteral(ast: ValueNode): Date {
    if (ast.kind !== Kind.INT) {
      throw new GraphQLError(
        `Can only parse an integer (representing a Unix timestamp) as a date, but got a ${ast.kind} type.`,
      );
    }
    return new Date(parseInt(ast.value, 10));
  }
}
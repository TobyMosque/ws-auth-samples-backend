import { PipeTransform } from '@nestjs/common';

export class QueryObjectTrasform implements PipeTransform {
  /**
   * Method to implement a custom pipe.  Called with two parameters
   *
   * @param value argument before it is received by route handler method
   * @param metadata contains metadata about the value
   */
  transform(value: Record<string, unknown>, meta) {
    console.log(value, meta);
    for (const key in value) {
      const cur = value[key];
      if (cur && typeof cur === 'string') {
        try {
          value[key] = JSON.parse(cur);
        } catch {
          // do nothing
        }
      }
    }
    delete value.count;
    return value;
  }
}

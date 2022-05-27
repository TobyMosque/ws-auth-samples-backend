export class FindRequestDto<TSelect, TInclude> {
  select?: TSelect;
  include?: TInclude;
}

export class QueryRequestDto<TWhere, TCursor, TOrderBy, TSelect, TInclude> {
  take?: number;
  skip?: number;
  where?: TWhere;
  cursor?: TCursor;
  orderBy?: TOrderBy;
  select?: TSelect;
  include?: TInclude;
}

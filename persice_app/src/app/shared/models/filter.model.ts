export interface InterfaceFilter {
  cumulative_match_score?: number;
  distance: number;
  distance_unit: string;
  gender: string;
  id?: number;
  keyword: string;
  max_age: string;
  min_age: string;
  order_criteria: string;
  resource_uri?: string;
  user?: string;
}

export class FilterModel {
  state: InterfaceFilter;

  constructor(
    state: InterfaceFilter
  ) {
    this.state = state;
  }
}

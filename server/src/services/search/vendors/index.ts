import {Users, Vendor} from '../../../models/users';
import {Role} from '../../../models/users/role';
import {BaseSearchQuery, SearchQueryResult, SearchQueryOptions} from '../base';

export type VendorSearchQueryOptions = SearchQueryOptions<Vendor>;

export class VendorSearchQuery extends BaseSearchQuery<
  Vendor,
  VendorSearchQueryOptions
> {
  protected static defaultOptions: VendorSearchQueryOptions = {
    page: 0,
    limit: 15,
  };

  constructor(options_: VendorSearchQueryOptions) {
    super(Object.assign({}, VendorSearchQuery.defaultOptions, options_));
  }

  async exec(): Promise<SearchQueryResult<Vendor>> {
    const aggregationPipeline = [];

    aggregationPipeline.push(
      {
        $match: {
          role: Role.VENDOR,
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $skip: this.options_.page! * this.options_.limit!,
      },
      {
        $limit:
          this.options_.limit! + 1 /* determines if there is a next page */,
      }
    );

    if (this.options_.fields) {
      aggregationPipeline.push({
        $project: Object.fromEntries(this.options_.fields.map(el => [el, 1])),
      });
    }

    const res: Vendor[] = await Users.aggregate(
      aggregationPipeline
    ).allowDiskUse(true);

    if (res.length > this.options_.limit!) {
      return {
        next: true,
        count: res.length - 1,
        data: res.slice(0, -1),
      };
    } else {
      return {
        next: false,
        count: res.length,
        data: res,
      };
    }
  }
}

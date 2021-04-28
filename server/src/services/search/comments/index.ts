import {Types} from 'mongoose';

import {Comments, Comment} from '../../../models/comment';
import {BaseSearchQuery, SearchQueryResult, SearchQueryOptions} from '../base';

export type CommentSearchQueryOptions = SearchQueryOptions<Comment>;

export class CommentSearchQuery extends BaseSearchQuery<
  Comment,
  CommentSearchQueryOptions
> {
  protected static defaultOptions: CommentSearchQueryOptions = {
    page: 0,
    limit: 5,
  };

  constructor(protected adId_: string, options_: CommentSearchQueryOptions) {
    super(Object.assign({}, CommentSearchQuery.defaultOptions, options_));
  }

  async exec(): Promise<SearchQueryResult<Comment>> {
    const aggregationPipeline = [];

    aggregationPipeline.push(
      {
        $match: {
          adId: new Types.ObjectId(this.adId_),
        },
      },
      {
        $sort: {
          createdAt: -1,
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

    const res: Comment[] = await Comments.aggregate(
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

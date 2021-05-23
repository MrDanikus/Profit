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
          ad: new Types.ObjectId(this.adId_),
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
        $limit: this.options_.limit!,
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author',
        },
      },
      {
        $unwind: {
          path: '$author',
        },
      },
      {
        $project: {
          author: {
            login: 0,
            password: 0,
            likes: 0,
            createdAt: 0,
          },
        },
      }
    );

    if (this.options_.fields) {
      aggregationPipeline.push({
        $project: Object.fromEntries(this.options_.fields.map(el => [el, 1])),
      });
    }

    return await Comments.aggregate(aggregationPipeline).allowDiskUse(true);
  }
}

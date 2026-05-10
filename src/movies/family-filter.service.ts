import { Injectable } from '@nestjs/common';

@Injectable()
export class FamilyFilterService {
  categoryFilterParams(category: string) {
    const categoryFilters: Record<string, string | number | boolean> = {};

    const todayObj = new Date();
    const formatDate = (d) => d.toISOString().split('T')[0];

    const today = formatDate(todayObj);

    const eightWeeksAgoObj = new Date();
    eightWeeksAgoObj.setDate(todayObj.getDate() - 56);
    const eightWeeksAgo = formatDate(eightWeeksAgoObj);

    // Set default family-safe filters
    categoryFilters['include_adult'] = false;
    categoryFilters['certification_country'] = 'US';
    categoryFilters['certification.lte'] = 'PG';
    categoryFilters['with_genres'] = '10751,16'; // family, animation
    // categoryFilters['without_genres'] = '53,27,80,10749'; // horror, drama, crime, thriller

    if (category === 'now_playing') {
      categoryFilters['release_date.gte'] = eightWeeksAgo;
      categoryFilters['release_date.lte'] = today;
      categoryFilters['with_release_type'] = '2|3|4';
    } else if (category === 'top_rated') {
      categoryFilters['sort_by'] = 'vote_average.desc';
      categoryFilters['vote_count.gte'] = 300;
    } else if (category === 'upcoming') {
      categoryFilters['release_date.gte'] = today;
      categoryFilters['with_release_type'] = '2|3|4';
    } else if (category === 'trending') {
      categoryFilters['sort_by'] = 'popularity.desc';
    }

    return categoryFilters;
  }
}

import type { EntityManager } from '@mikro-orm/mysql';
import { Seeder } from '@mikro-orm/seeder';
import { Show } from '../../show/show.entity.js';
import { Movie } from '../../movie/movie.entity.js';

export class TestSeeder extends Seeder {

  async run(em: EntityManager): Promise<void> {

    const show = em.create(Show, {
      date: '2023-10-01T20:00:00Z',
      state: 'scheduled',
      showCat: 1,
      showMovie: 1,
      showRoom: 1
    });

    const movie = em.create(Movie, {
      name: 'Test Movie',
      duration: 120,
      synopsis: 'This is a test movie for seeding purposes.',
    });
  }

}

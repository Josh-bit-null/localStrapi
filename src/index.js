'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    const uid = 'api::fair-event.fair-event';
    const publishedEvents = [
      { title: 'Aurora Code Sprint', orgId: 'csc', startsAt: '2026-11-08T05:00:00.000Z', venue: 'Innovation Hub', description: 'Teams solve timed programming challenges.', cancelled: false },
      { title: 'Binary Logic Cafe', orgId: 'csc', startsAt: '2026-11-10T03:00:00.000Z', venue: 'Library Annex', description: 'A casual algorithm-and-puzzles meet-up.', cancelled: false },
      { title: 'Pixel-Perfect UI Lab', orgId: 'itso', startsAt: '2026-11-12T04:00:00.000Z', venue: 'ICT Studio 3', description: 'Build responsive layouts from design mockups.', cancelled: false },
      { title: 'Cloud Security Pulse', orgId: 'itso', startsAt: '2026-11-13T06:00:00.000Z', venue: 'AV Room B', description: 'Hands-on cloud safety demonstrations.', cancelled: false },
      { title: 'Rover Discovery Night', orgId: 'robotics', startsAt: '2026-11-15T02:00:00.000Z', venue: 'Research Courtyard', description: 'Students showcase autonomous rover projects.', cancelled: false },
      { title: 'Three-Point Showcase', orgId: 'ballers', startsAt: '2026-11-16T08:00:00.000Z', venue: 'Westside Gym', description: 'Friendly shooting contests and mini-games.', cancelled: false },
      { title: 'Golden Hour Photo Walk', orgId: 'pixel', startsAt: '2026-11-09T22:00:00.000Z', venue: 'Plaza Fountain', description: 'A cancelled photography outing for the golden-hour theme.', cancelled: true },
      { title: 'Acoustic Fusion Night', orgId: 'tunog', startsAt: '2026-11-14T09:00:00.000Z', venue: 'Open Amphitheatre', description: 'An acoustic collaboration featuring student ensembles.', cancelled: false },
    ];

    const draftEvent = {
      title: 'Neighborhood Digital Clinic',
      orgId: 'tabang',
      startsAt: '2026-11-18T05:00:00.000Z',
      venue: 'Tabang Community Room',
      description: 'Draft planning session for the next community computer clinic.',
      cancelled: false,
    };

    for (const data of publishedEvents) {
      const existing = await strapi.documents(uid).findFirst({
        filters: { title: data.title },
        status: 'published',
      });
      if (!existing) {
        await strapi.documents(uid).create({ data, status: 'published' });
      }
    }

    const existingDraft = await strapi.documents(uid).findFirst({
      filters: { title: draftEvent.title },
      status: 'draft',
    });
    if (!existingDraft) {
      await strapi.documents(uid).create({ data: draftEvent, status: 'draft' });
    }

    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });
    if (!publicRole) return;

    for (const action of [
      'api::fair-event.fair-event.find',
      'api::fair-event.fair-event.findOne',
    ]) {
      const existingPermission = await strapi
        .query('plugin::users-permissions.permission')
        .findOne({ where: { action, role: publicRole.id } });
      if (!existingPermission) {
        await strapi.query('plugin::users-permissions.permission').create({
          data: { action, role: publicRole.id, enabled: true },
        });
      }
    }
  },
};

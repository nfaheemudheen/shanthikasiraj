import { socials, stats } from './content'
import { topics } from './posts'

export const topicLabel = (id) => topics.find((topic) => topic.id === id)?.label ?? 'Journal'

/* ------------------------------------------------------------------ */
/*  Journal copy                                                       */
/* ------------------------------------------------------------------ */
export const journal = {
  badge: 'The Shanthi Kasiraj Journal',
  titleLines: ['Train wiser.', 'Live stronger.'],
  lead:
    'Practical, no-nonsense notes on strength, nutrition and women’s health — written for real routines, real kitchens and real bodies, at every stage of life.',
  meta: ['New reads every week', 'No hype. No crash diets.'],
}

/** The blog index highlights one story; everything else is filterable. */
export const featuredSlug =
  'how-to-stick-to-your-nutrition-consultant-plan-practical-strategies-for-long-term-success'

/* ------------------------------------------------------------------ */
/*  YouTube — watch & move                                             */
/* ------------------------------------------------------------------ */
export const watchVideos = [
  {
    id: 'LLzFOSVwSFY',
    title: '6 Nutrition Myths Busted! Eggs, Rice, Sugar-Free Foods & Protein Explained',
    cardTitle: '6 nutrition myths, busted',
    tag: 'Nutrition',
  },
  {
    id: 'sS19ZnHlVWg',
    title: 'Belly Fat Not Going? Here’s Why! 7 Reasons & What You Should Do',
    cardTitle: 'Why belly fat stays put',
    tag: 'Fat loss',
  },
  {
    id: 'T0qBARNOxjc',
    title: 'Every Woman Must Know This About Her Health — Puberty to Menopause',
    cardTitle: 'Your health, puberty to menopause',
    tag: 'Women’s health',
  },
  {
    id: 'ace_RYdzla0',
    title: '10-Minute Yoga Flow for Flexibility, Mobility & Strength',
    cardTitle: 'A 10-minute yoga reset',
    tag: 'Mobility',
  },
  {
    id: 'cF0c2LrWjXc',
    title: 'Knee Pain? Try These 5 Easy Knee-Strengthening Exercises',
    cardTitle: '5 exercises for happy knees',
    tag: 'Strength',
  },
  {
    id: 'ejWlbFfmG3U',
    title: 'Postpartum Belly Not Reducing? Diastasis Recti Explained + 3 Safe Exercises',
    cardTitle: 'Postpartum core, explained',
    tag: 'Postpartum',
  },
  {
    id: 'q2bB6lZTb4k',
    title: '7 Easy Exercises Anyone Can Do at Home | Beginner-Friendly Full Body Workout',
    cardTitle: '7 easy exercises at home',
    tag: 'Beginner',
  },
  {
    id: 'xeyvFkidWfM',
    title: 'Don’t Just Lose Weight, Build Strength',
    cardTitle: 'Build strength, not just weight loss',
    tag: 'Strength',
  },
]

/* ------------------------------------------------------------------ */
/*  Social channels — content beyond the journal                       */
/* ------------------------------------------------------------------ */
const statByLabel = Object.fromEntries(stats.map((stat) => [stat.label, `${stat.value}${stat.suffix}`]))

export const channels = [
  ...socials.map((social) => ({
    ...social,
    followers:
      social.label === 'YouTube'
        ? statByLabel['YouTube subscribers']
        : social.label === 'Facebook'
          ? statByLabel['Facebook community']
          : social.label === 'Instagram'
            ? statByLabel['Instagram family']
            : 'Professional',
    note:
      social.label === 'YouTube'
        ? 'Workouts, myth-busting and honest health talks.'
        : social.label === 'Instagram'
          ? 'Everyday snippets, form checks and food ideas.'
          : social.label === 'Facebook'
            ? 'A supportive community of women showing up daily.'
            : 'Coaching philosophy, collaborations and press.',
  })),
]

/* ------------------------------------------------------------------ */
/*  Coach                                                    */
/* ------------------------------------------------------------------ */
export const coach = {
  name: 'Shanthi Kasiraj',
  role: 'Certified Fitness Coach & Nutritionist',
  quote:
    'I don’t write for perfect people with perfect schedules. I write for women who want to feel strong in the life they already have.',
  credentials: ['Certified fitness coach', 'Nutritionist', 'Women-only group training', 'Online coaching'],
  image: '/images/shanthi-about.webp',
}

const path = require('path');

const jobsQuery = require('./src/queries/jobs');

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  const studies = await graphql(`
    {
      allCaseStudy {
        nodes {
          id
          title
          path {
            alias
          }
        }
      }
    }
  `);

  studies.data.allCaseStudy.nodes.map(studyData =>
    createPage({
      path: studyData.path.alias,
      component: path.resolve(`src/templates/studies.js`),
      context: {
        StudyId: studyData.id,
      },
    })
  );

  const insights = await graphql(`
    {
      allInsight {
        nodes {
          id
          title
          path {
            alias
          }
        }
      }
    }
  `);
  insights.data.allInsight.nodes.map(insightData =>
    createPage({
      path: insightData.path.alias,
      component: path.resolve(`src/templates/insights.js`),
      context: {
        PostId: insightData.id,
      },
    })
  );

  const jobs = await graphql(jobsQuery);

  const JobTemplate = path.resolve(`src/templates/job.js`);
  jobs.data.allResumatorJob.nodes
    .filter(j => j.status === 'Open')
    .map(job =>
      createPage({
        path: `/careers/${job.title.toLowerCase().replace(/ /g, '-')}`,
        component: JobTemplate,
        context: {
          job,
        },
      })
    );
};

import { gql } from "@apollo/client";

export const LOAD_REPOS = gql`
  query {
    user(login: "colbyfayock") {
      pinnedItems(first: 6) {
        totalCount
        edges {
          node {
            ... on Repository {
              name
              id
              url
              stargazers {
                totalCount
              }
              forkCount
            }
          }
        }
      }
    }
  }
`;

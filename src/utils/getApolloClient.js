import {ApolloClient, InMemoryCache} from "@apollo/client";

export default function getApolloClient() {
  const client = new ApolloClient({
    uri: "https://lty2jmadwi.execute-api.eu-west-3.amazonaws.com/dev/graphql",
    cache: new InMemoryCache(),
  });

  return client;
}

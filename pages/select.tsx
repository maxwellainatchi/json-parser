import type { NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import FileInput from "../components/FileInput";
import { Card, Container, Divider } from "@nextui-org/react";
import DB, { JSONFile } from "../models/db";
import { useLiveQuery as _useLiveQuery } from "dexie-react-hooks";

const useLiveQuery = <T extends object>(
  query: () => Promise<T>
): T | undefined => {
  let [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return _useLiveQuery<T | undefined>(() => {
    if (isClient) {
      return query();
    }
  }, [isClient]);
};

const Home: NextPage = () => {
  const files = useLiveQuery(() => DB.files.toArray());

  return (
    <Container style={{ marginTop: "1em" }}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Card>
        {files
          ? files.map((file) => (
              <Card key={file.id} style={{ marginBottom: "10px" }}>
                <div>{file.name}</div>
              </Card>
            ))
          : "loading files..."}
        <FileInput
          onFileSelect={async (files) => {
            console.log(window);
            if (!files) return;
            DB.files.add({
              name: files[0].name,
              content: await files[0].text(),
            });
          }}
        />
      </Card>
    </Container>
  );
};

export default Home;

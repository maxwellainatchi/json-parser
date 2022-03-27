import type { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import FileInput from "../components/FileInput";
import {
  Button,
  Card,
  Container,
  Divider,
  Input,
  Link,
  Spacer,
  Text,
} from "@nextui-org/react";
import DB from "../models/db";
import Application from "../models/Application";
import { Shape } from "../models/Shape";
import { useRouter } from "next/router";
import useLiveQuery from "../utility/hooks/useLiveQuery";

const Home: NextPage = () => {
  const applications = useLiveQuery(() => Application.list());

  const [file, setFile] = useState<File | undefined>();
  const [name, setName] = useState("");
  const router = useRouter();

  return (
    <Container style={{ marginTop: "1em", maxWidth: "800px" }}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Card
        as={"form"}
        onSubmit={async (e) => {
          e.preventDefault();

          // TODO: Validation
          if (!file || !name) {
            return;
          }

          let item = {
            name: file.name,
            content: await file.text(),
            uploadedAt: new Date(),
          };

          let dbFileId = await DB.files.put(item);
          let shape = Shape.parse(JSON.parse(item.content));

          let application = await Application.create(name, dbFileId, shape);

          await router.push(`/${application.id}/parse`);
        }}
      >
        <Card.Body>
          {applications?.length ? (
            <div>
              <Text h2>Select an existing application</Text>
              <Spacer />
              {applications.map((application) => (
                <Card key={application.id}>
                  <Link href={`${application.id}/parse`}>
                    <Text h4>{application.name}</Text>
                  </Link>
                </Card>
              ))}
            </div>
          ) : applications ? null : (
            "loading.."
          )}
          {!applications || (applications.length > 0 && <Spacer />)}
          <Divider />
          <Spacer />
          <Text h2>New Application</Text>
          <Spacer />
          <Input
            placeholder={"Application name"}
            required
            pattern="\w{3,}"
            onInvalid={console.log}
            value={name}
            onChange={({ target: { value } }) => setName(value.trim())}
          />
          <Spacer />
          <FileInput
            style={{ flex: "1 0 auto" }}
            onFileSelect={async (files) => {
              if (!files?.length) return;
              setFile(files[0]);
            }}
            accept={".json"}
            required
          />
        </Card.Body>
        <Divider />
        <Card.Footer>
          <Button type={"submit"}>Create</Button>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default Home;
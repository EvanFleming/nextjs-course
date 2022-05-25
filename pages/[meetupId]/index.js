import MeetupDetail from "../../components/meetups/MeetupDetail";
import Head from 'next/head';

import { MongoClient, ObjectId } from "mongodb";
function MeetupDetails(props) {
  return (
    <>
    <Head>
      <title>{props.meetupData.title}</title>
      <meta name="description" content={props.meetupData.description}/>
    </Head>
    <MeetupDetail
      title={props.meetupData.title}
      address={props.meetupData.city}
      image={props.meetupData.image}
      description={props.meetupData.description}
    />
    </>
  );
}

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    "mongodb+srv://react-next-js:AM8KepnJiyM1XedK@cluster0.zqow5.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();
  return {
    fallback: 'blocking',  //false,
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;
  console.log(meetupId);

  const client = await MongoClient.connect(
    "mongodb+srv://react-next-js:AM8KepnJiyM1XedK@cluster0.zqow5.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const selectedMeetup = await meetupsCollection.findOne({ _id: ObjectId(meetupId) });

  client.close();

  return {
    props: {
      meetupData: {
        id:selectedMeetup._id.toString(),
        title:selectedMeetup.title,
        address:selectedMeetup.address,
        image:selectedMeetup.image,
        description:selectedMeetup.description,
      }
    },
  };
}

export default MeetupDetails;

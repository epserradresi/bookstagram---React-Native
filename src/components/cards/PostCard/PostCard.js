import React, {useState, useEffect} from 'react';
import {View, Text, Image, ScrollView} from 'react-native';
import database from '@react-native-firebase/database';
import styles from './PostCard.style';
import {compareDesc, formatDistanceToNow, parseISO} from 'date-fns';

const PostCard = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    database()
      .ref('users/')
      .on('value', snapshot => {
        const usersData = snapshot.val();
        const posts = [];

        for (const userId in usersData) {
          const user = usersData[userId];

          if ((user.shared, user.photos)) {
            for (const postId in user.shared) {
              const post = user.shared[postId];
              post.name = user.profile.name;
              post.profile = {photo: user.photos.profile};
              posts.push(post);
            }
          }
        }
        const sortedPosts = posts.sort((a, b) => {
          if (a.date === b.date) {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
          }
          return compareDesc(new Date(a.date), new Date(b.date));
        });

        setPosts(sortedPosts);
      });
  }, []);

  return (
    <ScrollView>
      {posts.map(post => (
        <View key={post.text} style={styles.container}>
          <View style={styles.header_container}>
            {post.profile ? (
              <Image
                style={styles.profile_image}
                source={{uri: post.profile.photo}}
              />
            ) : (
              <Image
                style={styles.profile_image}
                source={require('../../../assest/images/defaultProfile.png')}
              />
            )}

            <View style={styles.name_date}>
              <Text style={styles.user_name}>{post.name}</Text>
              <Text style={styles.date}>
                {formatDistanceToNow(parseISO(post.date), {addSuffix: true})}
              </Text>
            </View>
          </View>

          <Text style={styles.message}>{post.text}</Text>
          <View style={styles.shared_image_container}>
            {post.photo && (
              <Image style={styles.shared_image} source={{uri: post.photo}} />
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default PostCard;

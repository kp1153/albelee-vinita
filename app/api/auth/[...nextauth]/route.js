async signIn({ user }) {
  const { name, email, image } = user;

  if (email === 'albelee1153@gmail.com') {
    return true; // admin, DB में save मत करो
  }

  await client.execute(
    `INSERT INTO customers (name, email, image_url, google_id)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(email) DO UPDATE SET name=?, image_url=?`,
    [name, email, image, email, name, image]
  );
  return true;
},
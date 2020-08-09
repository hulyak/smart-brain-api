const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;
  // validation check
  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission');
  }
  const hash = bcrypt.hashSync(password);

  //transactions if one fails, all fails - use it when you have to do more than two things at once
  db
    .transaction((trx) => {
      trx
        .insert({
          hash: hash,
          email: email,
        })
        .into('login')
        .returning('email')
        .then((loginEmail) => {
          return trx('users')
            .returning('*') //return all the columns with the new user
            .insert({
              email: loginEmail[0],
              name: name,
              joined: new Date(),
            })
            .then((user) => {
              //  res.json(database.users[database.users.length - 1]);
              res.json(user[0]);
            });
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch((err) => res.status(400).json('unable to register')); //email must be unique, don't show reason to client
};

module.exports = {
  handleRegister: handleRegister,
};

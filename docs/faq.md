# What is Contenty?

`Contenty` is a system that I use in order to record my life. It is also used by
my clients and others to record other things such as blog posts, users in a social
network, or a file system. It is a thin layer over data.

# What's A Thin Layer Over Data?

`Contenty` allows you to create what we call `collections`, which are ways to group
`items` together. You can store anything that is JSON as an `item`. You can also
create schemas in order to enforce the inputs of your `items`.

`Contenty` tries to stay out of your way and just offer helpful ways of interacting with
your underlying data.

# What are Collections?

Think of `collections` as a big array of items that `Contenty` allows you to query/update.
You can create your own collections at any time and can update their metadat.

# What are Items?

Each `collection` is made up of a list of `items`. `items` are the _things_ that the `collection`
_is_.

# How do I...

## Install Contenty Locally?

```sh
git clone git@github.com:beardedtim/contenty.git

cd contenty

yarn

# You can also use npm

npm i
```

## Run Contenty Locally?

```sh
yarn dev

# You can also use npm

npm run dev
```

## Use the API?

You can find an up-to-date Insomnia collection [here](./assets/insomnia.yml) that the development
team uses.

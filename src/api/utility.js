const minutesPerCharacter = 0.0012;

const timeToRead = (text) => Math.ceil(text.length * minutesPerCharacter);

const teaser = (text) => text.substring(0, 300) + "...";

const capitalize = (phrase) => {
  return phrase.replace(/^\w/, (c) => c.toUpperCase());
};

export { timeToRead, teaser, capitalize };

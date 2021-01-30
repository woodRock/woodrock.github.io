const minutesPerCharacter = 0.0012;

const timeToRead = (text) => Math.ceil(text.length * minutesPerCharacter);

const teaser = (text) => text.substring(0, 300) + "...";

export { timeToRead, teaser };

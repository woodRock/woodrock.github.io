import React from 'react';
import './index.css';
import ReactMarkdown from 'react-markdown'

const md = `
isBeautiful :: Int -> Int -> Bool
isBeautiful k x = mod res k == 0
  where
    res = abs (x - r)
    r = (read $ reverse $ show x) :: Int

solve :: [String] -> Int
solve x = length $ filter (isBeautiful k) [start..end]
  where
    k = (read $ last x) :: Int
    start = (read $ head x) :: Int
    end = (read $ head $ tail x) :: Int

main :: IO ()
main = do
  arr &lt;- getLine
  let x = words arr
  print $ solve x
`;

const LandingPage = () => (
  <div>
    <h1>WoodRock</h1>
    <section>
      <div class="static">
        <span className="pink">user</span>
        <span className="white">@</span>
        <span className="blue">woodRock</span>
        <span className="white">:</span>
        <span className="green">~$</span>
      </div>
      <div class="input" contenteditable="true">
        <ReactMarkdown source={md}></ReactMarkdown>
      </div>
    </section>
  </div>
);

export default LandingPage;

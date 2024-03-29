import * as fs from "node:fs"
import * as path from "node:path";
import {promisify} from "node:util";

import {imagePath, rootDir} from "../util";

import {gm} from "./images";

const YUD_HEIGHT_MAX = 3;
const YUD_HEIGHT_MIN = 0.01;
const YUD_WIDTH_MAX = 3;
const YUD_WIDTH_MIN = 0.01;

const rand_range =
    (min: number, max: number) => { return Math.random() * (max - min) + min; };

interface Size {
  width: number;
  height: number;
}

const yud_path = path.join(imagePath, "yud.png");

let yud_size: Size|null = null;

const get_size = async () => {
  const _size = (callback: (err: any, data: any) =>
                     any) => { gm(yud_path).size(callback); };

  return (await promisify(_size)()) as Size;
};

export async function getYud() {
  const yud_h = rand_range(YUD_HEIGHT_MIN, YUD_HEIGHT_MAX);
  const yud_w = rand_range(YUD_WIDTH_MIN, YUD_WIDTH_MAX);

  yud_size = yud_size ?? (await get_size());

  const generated_dir = path.join(rootDir, "generated")

  if (!fs.existsSync(generated_dir)) {
    fs.mkdirSync(generated_dir)
  }

  const output_path = path.join(generated_dir, "generated_yud.png");
  const [h, w] = [ yud_size.height, yud_size.width ];

  if (!fs.existsSync(output_path)) {
    fs.copyFileSync(yud_path, output_path)
  }

  const _resize_yud = promisify((callback: (...args: any[]) => void) => {
    gm(yud_path).resize(yud_w * w, yud_h * h, "!").write(output_path, callback);
  });

  await _resize_yud();

  return output_path;
}

const models = require("../../models/index.cjs");
const _ = require("lodash");
const fs = require("fs").promises;

const groupId = process.argv[2];
const outFile = process.argv[3];

const clean = (text) =>
  text
    .replace(/["\n\r]/g, "")
    .replace(/,/g, ";")
    .replace(/´/g, "")
    .trim();

const getYear = (post) =>
  post.public_data &&
  post.public_data.galleryMetaData &&
  post.public_data.galleryMetaData.Upphafsar
    ? post.public_data.galleryMetaData.Upphafsar
    : "";

const main = async () => {
  const group = await models.Group.findByPk(groupId, { attributes: ["name"] });
  const posts = await models.Post.unscoped().findAll({
    where: { group_id: groupId },
    order: [["counter_endorsements_up", "desc"]],
    include: [{ model: models.User, required: true }],
  });

  let outFileContent = `"${group.name}"\n"Atkvæðafjöldi","Nafn listmanns","Heiti verks ísl.","Heiti verks en.","Ártal verks"\n`;

  for (const post of posts) {
    if (!post.deleted) {
      outFileContent +=
        `${post.counter_endorsements_up},"${clean(post.description)}","${clean(
          post.name
        )}",` + `"","${getYear(post)}"\n`;
    }
  }

  try {
    await fs.writeFile(outFile, outFileContent);
    log.info("The file was saved!");
    process.exit();
  } catch (err) {
    log.info(err);
  }
};

main();

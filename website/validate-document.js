// @ts-check

const fs = require('fs');
const path = require('path');
const ignore = require('ignore');

const imageTagsRegex = /(<img\b[^>]*>)|!\[.*?\]\((.*?)\)/g;
const imageNameRegex = /^(?:[a-z0-9_\-]+?)(?:_(\d{2,4})dpi)?\.(png|jpe?g|gif|mp4)$/i;
const srcAttributeRegex = attributeRegex('src');
const altAttributeRegex = attributeRegex('alt');
const widthAttributeRegex = attributeRegex('width');
const heightAttributeRegex = attributeRegex('height');
const decodingAttributeRegex = attributeRegex('decoding');
const loadingAttributeRegex = attributeRegex('loading');

const checkImageNameConvention = (imagePath, errors) => {
  const imageName = path.basename(imagePath);
  const imageNameMatch = imageName.match(imageNameRegex);
  if (!imageNameMatch) {
    errors.push(['warn', `Image (${imagePath}) does not follow the name convention: {name}_{density}dpi.{extension}. (Assuming 96 DPI.)`]);
    return [96, path.extname(imageName)];
  }

  let [, dpi, ext] = imageNameMatch;
  if (!dpi) {
    errors.push(['warn', `Image (${imagePath}) does not include the image DPI value. (Assuming 96 DPI.)`]);
    return [96, ext];
  }

  return [Number(dpi), ext];
}

const checkForImageAttributes = (imageTag, errors) => {
  const srcAttributeMatch = imageTag.match(srcAttributeRegex);
  const altAttributeMatch = imageTag.match(altAttributeRegex);
  const widthAttributeMatch = imageTag.match(widthAttributeRegex);
  const heightAttributeMatch = imageTag.match(heightAttributeRegex);
  const decodingAttributeMatch = imageTag.match(decodingAttributeRegex);
  const loadingAttributeMatch = imageTag.match(loadingAttributeRegex);
  let imageSrc, cssWidth, cssHeight;

  if (srcAttributeMatch) {
    imageSrc = srcAttributeMatch[1] || srcAttributeMatch[2];
  } else {
    errors.push(`Attribute (src="...") not found in ${imageTag}`)
  }

  if (!altAttributeMatch) {
    errors.push(`Attribute (alt="...") not found in ${imageTag}`)
  }

  if (widthAttributeMatch) {
    cssWidth = Number(widthAttributeMatch[1] || widthAttributeMatch[2])
  } else {
    errors.push(['warn', `Attribute (width="...") not found in ${imageTag}`])
  }

  if (heightAttributeMatch) {
    cssHeight = Number(heightAttributeMatch[1] || heightAttributeMatch[2])
  } else {
    errors.push(['warn', `Attribute (height="...") not found in ${imageTag}`])
  }

  if (!decodingAttributeMatch) {
    errors.push(['warn', `Attribute (decoding="...") not found in ${imageTag}`])
  }

  if (!loadingAttributeMatch) {
    errors.push(['warn', `Attribute (loading="...") not found in ${imageTag}`])
  }

  return [imageSrc, cssWidth, cssHeight];
};

const checkImages = async (content) => {
  const errors = [];

  let i = -1;
  for (const tag of extractImageData(content)) {
    i++;

    const isMarkdown = tag.startsWith('![');
    if (isMarkdown) {
      // Markdown image detected
      errors.push(['warn', `Markdown image syntax found (${tag}). Use <img src="..." alt="..." width="..." height="..." /> instead for images.`]);
      continue;
    }

    let [imageSrc] = checkForImageAttributes(tag, errors);

    const pathPrefix = "/docs/"
    if (imageSrc.startsWith(pathPrefix)) {
      imageSrc = imageSrc.substring(pathPrefix.length - 1);
    } else if (/^https?:/i.test(imageSrc)) {
      continue;
    } else {
      errors.push(`Invalid image src found in ${tag}`);
      continue;
    }

    checkImageNameConvention(imageSrc, errors);

  }

  return errors;
};

const checkDocumentFile = async (fileFullPath, ignore) => {
  const filePath = path.relative(__dirname, fileFullPath).replaceAll('\\', '/');
  console.log(`Checking file: "${filePath}"`);

  const errors = [], warnings = [];

  try {
    const content = fs.readFileSync(fileFullPath, 'utf-8');
    console.log('Running image checks...');
    const imageCheckErrors = await checkImages(content);
    if (imageCheckErrors.length) {
      const strict = !ignore.ignores(filePath);
      for (const error of imageCheckErrors) {
        const [isWarning, message] = !Array.isArray(error) ? [false, error] : [error[0] === 'warn', error[1]];
        (!isWarning || strict ? errors : warnings).push(message);
      }
    } else {
      console.log('Image checks passed.')
    }

  } catch (err) {
    console.error(`Error reading file "${filePath}": ${err.message}`);
    errors.push(`File read error: ${err.message}`);
  }

  if (warnings.length > 0) {
    console.warn(`Warnings in file "${filePath}":\n- ${warnings.join('\n- ')}`);
  }

  if (errors.length > 0) {
    console.error(`Errors in file "${filePath}":\n- ${errors.join('\n- ')}`);
    return errors;
  } else {
    console.log(`${filePath}: Passed all checks.`);
    return null;
  }


}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.log('No markdown files to check.');
  process.exit(0);
}

let allErrors = [];
const checkFiles = async () => {
  const ig = ignore().add(fs.readFileSync(path.join(__dirname, '.validationignore'), 'utf-8'));
  for (const file of files) {
    if (file.endsWith('.mdx')) {
      const filePath = path.resolve(__dirname, '..', file); // Resolve the path relative to the root of the repo
      const errors = await checkDocumentFile(filePath, ig);
      if (errors) {
        allErrors = allErrors.concat(errors);
      }
    }
  }

  if (allErrors.length > 0) {
    console.error('Markdown validation failed with the following errors:');
    allErrors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  } else {
    console.log('All markdown files passed validation.');
  }
}

// Helper functions

function attributeRegex(attribute) {
  return new RegExp(`${attribute}=(?:"([^"]*)"|'([^']*)')`);
}

function* extractImageData(content) {
  let imageTagsRegexMatch;
  while ((imageTagsRegexMatch = imageTagsRegex.exec(content)) !== null) {
    const [tag] = imageTagsRegexMatch;
    yield tag;
  }
}

checkFiles();
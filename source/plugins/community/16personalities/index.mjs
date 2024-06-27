//Setup
export default async function({login, q, imports, data, account}, {enabled = false, extras = false} = {}) {
  //Plugin execution
  try {
    //Check if plugin is enabled and requirements are met
    if ((!q["16personalities"]) || (!imports.metadata.plugins["16personalities"].enabled(enabled, {extras})))
      return null

    //Load inputs
    let {url, sections, scores} = imports.metadata.plugins["16personalities"].inputs({data, account, q})

    //Fetch raw data
    const raw = {
      color: 'rgb(243, 239, 245)',
      type: '(INTP-A)',
      personality: [],
      traits: [],
    }

    //Format data
    const {color} = raw
    const type = raw.type.replace("(", "").replace(")", "").trim()
    const personality = await Promise.all(raw.personality.map(async ({category, value, image, text}) => ({
      category,
      value: value.replace(`(${type})`, "").trim(),
      image: await imports.imgb64(image),
      text: text.replace(`${category}\n${value}\n`, "").trim(),
    })))
    const traits = raw.traits.map(({category, value, score, text}) => ({
      category,
      value: `${value[0]}${value.substring(1).toLocaleLowerCase()}`,
      score: scores ? Number(score.replace("%", "")) / 100 : NaN,
      text: text.split(".").slice(1).join("."),
    }))

    //Results
    return {sections, color, type, personality, traits}
  }
  //Handle errors
  catch (error) {
    throw imports.format.error(error)
  }
}

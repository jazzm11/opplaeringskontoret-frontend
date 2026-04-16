const showFaq = async (req, res) => {
  console.log("[SUCCESS][FRONTEND][PAGE] Rendered FAQ");
  return res.render("faq");
};

module.exports = {
  showFaq,
};


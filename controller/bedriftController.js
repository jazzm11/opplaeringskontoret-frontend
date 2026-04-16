const postApi = require("../utils/postApi");
const getApi = require("../utils/getApi");

const showCreateBedrift = (req, res) => {
  console.log("[SUCCESS][FRONTEND][PAGE] Rendered create-bedrift");
  res.render("create-bedrift");
};

const loadVurderingFormData = async (token, selectedBedriftId) => {
  const bedrifterResponse = await getApi("/bedrift/mine", token);
  const bedrifter = bedrifterResponse.bedrifter || [];
  const activeBedriftId =
    selectedBedriftId || (bedrifter.length > 0 ? String(bedrifter[0]._id) : "");

  let elever = [];
  if (activeBedriftId) {
    const eleverResponse = await getApi(`/bedrift/${activeBedriftId}/elever`, token);
    elever = eleverResponse.elever || [];
  }

  return { bedrifter, elever, activeBedriftId };
};

const showRegisterElev = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const response = await getApi("/bedrift/mine", token);
    const bedrifter = response.bedrifter || [];
    console.log("[SUCCESS][FRONTEND][PAGE] Rendered register-elev");
    return res.render("register-elev", { bedrifter });
  } catch (error) {
    error.status = 500;
    error.message = "Kunne ikke laste bedriftene dine.";
    return next(error);
  }
};

const showVurderingForm = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const { bedriftId } = req.query;
    const data = await loadVurderingFormData(token, bedriftId);
    console.log("[SUCCESS][FRONTEND][PAGE] Rendered send-vurdering");
    return res.render("send-vurdering", data);
  } catch (error) {
    error.status = 500;
    error.message = "Kunne ikke laste data for vurderingsskjema.";
    return next(error);
  }
};

const createBedrift = async (req, res, next) => {
  try {
    const { name, type, contactPerson, email, password, confirmPassword } = req.body;
    const token = req.cookies.token;
    const response = await postApi(
      "/bedrift/create",
      {
        name,
        type,
        contactPerson,
        email,
        password,
        confirmPassword,
      },
      token
    );

    if (response.error) {
      return res.render("create-bedrift", {
        error: response.error,
        name,
        type,
        contactPerson,
        email,
        password,
        confirmPassword,
      });
    }
    console.log(`[SUCCESS][FRONTEND][BEDRIFT] Bedrift created: ${name} (${email})`);
    res.redirect("/");
  } catch (error) {
    error.status = 500;
    error.message = "En uventet feil oppstod. Prøv igjen.";
    return next(error);
  }
};

const registerElev = async (req, res, next) => {
  try {
    const { name, email, bedriftId } = req.body;
    const token = req.cookies.token;
    const response = await postApi(
      `/bedrift/${bedriftId}/register-elev`,
      {
        name,
        email,
      },
      token
    );

    if (response.error) {
      const bedrifterResponse = await getApi("/bedrift/mine", token);
      return res.render("register-elev", {
        bedrifter: bedrifterResponse.bedrifter || [],
        error: response.error,
        name,
        email,
        bedriftId,
      });
    }

    const bedrifterResponse = await getApi("/bedrift/mine", token);
    console.log(`[SUCCESS][FRONTEND][BEDRIFT] Elev registered: ${email}`);
    return res.render("register-elev", {
      bedrifter: bedrifterResponse.bedrifter || [],
      success: "Elev ble registrert.",
    });
  } catch (error) {
    error.status = 500;
    error.message = "En uventet feil oppstod. Prøv igjen.";
    return next(error);
  }
};

const sendVurdering = async (req, res, next) => {
  try {
    const { bedriftId, elevId, text } = req.body;
    const token = req.cookies.token;

    const response = await postApi(
      `/bedrift/${bedriftId}/elev/${elevId}/vurdering`,
      { text },
      token
    );

    const data = await loadVurderingFormData(token, bedriftId);
    if (response.error) {
      return res.render("send-vurdering", {
        ...data,
        error: response.error,
      });
    }

    console.log(`[SUCCESS][FRONTEND][BEDRIFT] Vurdering sent to elev: ${elevId}`);
    return res.render("send-vurdering", {
      ...data,
      success: "Vurdering ble sendt.",
    });
  } catch (error) {
    error.status = 500;
    error.message = "En uventet feil oppstod. Prøv igjen.";
    return next(error);
  }
};

module.exports = {
  showCreateBedrift,
  createBedrift,
  showRegisterElev,
  registerElev,
  showVurderingForm,
  sendVurdering,
};

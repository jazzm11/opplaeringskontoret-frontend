const postApi = require("../utils/postApi");
const getApi = require("../utils/getApi");

const showCreateBedrift = (req, res) => {
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

const showRegisterElev = async (req, res) => {
  try {
    const token = req.cookies.token;
    const response = await getApi("/bedrift/mine", token);
    const bedrifter = response.bedrifter || [];
    return res.render("register-elev", { bedrifter });
  } catch (error) {
    console.log(error);
    return res.render("register-elev", {
      bedrifter: [],
      error: "Could not load your bedrifter.",
    });
  }
};

const showVurderingForm = async (req, res) => {
  try {
    const token = req.cookies.token;
    const { bedriftId } = req.query;
    const data = await loadVurderingFormData(token, bedriftId);
    return res.render("send-vurdering", data);
  } catch (error) {
    console.log(error);
    return res.render("send-vurdering", {
      bedrifter: [],
      elever: [],
      activeBedriftId: "",
      error: "Could not load vurdering form data.",
    });
  }
};

const createBedrift = async (req, res) => {
  try {
    const { name, type, contactPerson } = req.body;
    const token = req.cookies.token;
    const response = await postApi(
      "/bedrift/create",
      {
        name,
        type,
        contactPerson,
      },
      token
    );

    if (response.error) {
      return res.render("create-bedrift", {
        error: response.error,
        name,
        type,
        contactPerson,
      });
    }
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.render("create-bedrift", {
      error: "Unexpected error occurred. Please try again.",
    });
  }
};

const registerElev = async (req, res) => {
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
    return res.render("register-elev", {
      bedrifter: bedrifterResponse.bedrifter || [],
      success: "Elev registered successfully.",
    });
  } catch (error) {
    console.log(error);
    const token = req.cookies.token;
    const bedrifterResponse = await getApi("/bedrift/mine", token).catch(() => ({
      bedrifter: [],
    }));
    return res.render("register-elev", {
      bedrifter: bedrifterResponse.bedrifter || [],
      error: "Unexpected error occurred. Please try again.",
    });
  }
};

const sendVurdering = async (req, res) => {
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

    return res.render("send-vurdering", {
      ...data,
      success: "Vurdering sent successfully.",
    });
  } catch (error) {
    console.log(error);
    const token = req.cookies.token;
    const { bedriftId } = req.body;
    const data = await loadVurderingFormData(token, bedriftId).catch(() => ({
      bedrifter: [],
      elever: [],
      activeBedriftId: "",
    }));
    return res.render("send-vurdering", {
      ...data,
      error: "Unexpected error occurred. Please try again.",
    });
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

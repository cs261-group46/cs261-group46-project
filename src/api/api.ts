type args = { [key: string]: string | string[] | number };
type body = { [key: string]: any };

function argsToString(args: args) {
  let count = 1;
  let toReturn = "";
  const entries = Object.entries(args);
  for (const [key, value] of entries) {
    toReturn += Array.isArray(value)
      ? `${key}=${value.join()}`
      : `${key}=${value}`;

    if (count < entries.length) toReturn += "&";
    count++;
  }
  return toReturn;
}

export async function get(requestData: {
  resource: string;
  entity: number;
  args?: args;
}) {
  const response = await fetch(
    `/api/${requestData.resource}/${requestData.entity}${
      requestData.args ? "?" + argsToString(requestData.args) : ""
    }`
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors || ["Unexpected error occurred"]);
  }

  return data.data;
}

export async function update(requestData: {
  resource: string;
  entity: number;
  body: body;
}) {
  const response = await fetch(
    `/api/${requestData.resource}/${requestData.entity}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(requestData.body), // body data type must match "Content-Type" header
    }
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors || ["Unexpected error occurred"]);
  }
}

export async function store(requestData: {
  resource: string;
  entity?: number;
  body: body;
}) {
  const response = await fetch(`/api/${requestData.resource}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(requestData.body), // body data type must match "Content-Type" header
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors || ["Unexpected error occurred"]);
  }
}

export async function index(requestData: { resource: string; args?: args }) {
  const response = await fetch(
    `/api/${requestData.resource}/${
      requestData.args ? "?" + argsToString(requestData.args) : ""
    }`
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors || ["Unexpected error occurred"]);
  }

  return data.data;
}

export async function destroy(requestData: {
  resource: string;
  entity: number;
}) {
  const response = await fetch(
    `/api/${requestData.resource}/${requestData.entity}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors || ["Unexpected error occurred"]);
  }
}

export async function custom(requestData: {
  endpoint: string;
  entity?: number;
  method: string;
  body?: body;
  args?: args;
}) {
  const response = await fetch(
    `/api${requestData.endpoint}/${requestData.entity ?? ""}${
      requestData.args ? "?" + argsToString(requestData.args) : ""
    }`,
    {
      method: requestData.method,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(requestData.body), // body data type must match "Content-Type" header
    }
  );
  const data = await response.json();
  console.log(response.ok);

  if (!response.ok) {
    throw new Error(data.errors || ["Unexpected error occurred"]);
  }
  return data;
}

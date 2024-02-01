---
id: grpc
title: gRPC
description: gRPC related functionalities of the ConfigCat Proxy.
toc_max_heading_level: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

The ConfigCat Proxy can communicate over <a target="blank" href="https://grpc.io">gRPC</a>, an open-source, high-performance RPC framework with client support in several languages.

To establish gRPC connections, you'll need the protobuf and the gRPC <a target="blank" href="https://github.com/configcat/configcat-proxy/blob/main/grpc/proto/flag_service.proto">service definition</a>. It's required to generate clients with <a target="blank" href="https://protobuf.dev/downloads/">`protoc`</a> for your <a target="blank" href="https://protobuf.dev/reference/">desired platform</a>. 

```protobuf title="flag_service.proto"
syntax = "proto3";

option go_package = "github.com/configcat/configcat-proxy/grpc/proto";

package configcat;

import "google/protobuf/empty.proto";
import "google/protobuf/timestamp.proto";

// Service that contains feature flag evaluation procedures.
service FlagService {
  // Stream for getting notified when a feature flag's value changes.
  rpc EvalFlagStream(EvalRequest) returns (stream EvalResponse) {}
  // Stream for getting notified when any feature flag's value changes.
  rpc EvalAllFlagsStream(EvalRequest) returns (stream EvalAllResponse) {}

  // Evaluates a feature flag.
  rpc EvalFlag(EvalRequest) returns (EvalResponse) {}
  // Evaluates each feature flag.
  rpc EvalAllFlags(EvalRequest) returns (EvalAllResponse) {}
  // Requests the keys of each feature flag.
  rpc GetKeys(KeysRequest) returns (KeysResponse) {}
  // Commands the underlying SDK to refresh its evaluation data.
  rpc Refresh(RefreshRequest) returns (google.protobuf.Empty) {}
}

// Feature flag evaluation request message.
message EvalRequest {
  // The SDK identifier.
  string sdk_id = 1;
  // The feature flag's key to evaluate.
  string key = 2;
  // The user object.
  map<string, UserValue> user = 3;
}

// Feature flag evaluation response message.
message EvalResponse {
  // The evaluated value.
  oneof value {
    int32 int_value = 1;
    double double_value = 2;
    string string_value = 3;
    bool bool_value = 4;
  }
  // The variation ID.
  string variation_id = 5;
}

// Response message that contains the evaluation result of each feature flag.
message EvalAllResponse {
  // The evaluated value of each feature flag.
  map<string, EvalResponse> values = 1;
}

// Request message for getting each available feature flag's key.
message KeysRequest {
  // The SDK identifier.
  string sdk_id = 1;
}

// Response message that contains each available feature flag's key.
message KeysResponse {
  // The keys of each feature flag.
  repeated string keys = 1;
}

// Request message for the given SDK to refresh its evaluation data.
message RefreshRequest {
  // The SDK identifier.
  string sdk_id = 1;
}

// Defines the possible values that can be set in the `user` map.
message UserValue {
  oneof value {
    double number_value = 1;
    string string_value = 2;
    google.protobuf.Timestamp time_value = 3;
    StringList string_list_value = 4;
  }
}

// Represents a list of strings.
message StringList {
  repeated string values = 1;
}
```

In order to secure the gRPC communication with the Proxy, set up [TLS](/advanced/proxy/proxy-overview#tls).

## Client Usage

The following example uses a generated Go client, but gRPC clients generated for other languages are working as well.

```go title="example.go"
opts := []grpc.DialOption{
    grpc.WithBlock(),
    grpc.WithTransportCredentials(credentials.NewTLS(&tls.Config{
        // Any TLS options
    })),
}

conn, err := grpc.DialContext(context.Background(), 
    // highlight-next-line
    "localhost:50051", // Proxy host and gRPC port
    opts...)
if err != nil {
    panic(err)
}

defer func() {
    _ = conn.Close()
}()

client := proto.NewFlagServiceClient(conn)

ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

resp, err := client.EvalFlag(ctx, &proto.EvalRequest{
    SdkId: "my_sdk", 
    Key: "<flag-key>", 
    User: map[string]*proto.UserValue{"Identifier": {Value: &proto.UserValue_StringValue{StringValue: "<user-id>"}}}
})
if err != nil {
    panic(err)
}

fmt.Printf("Evaluation result: %v", resp.GetBoolValue())
```

## Available Options

The following gRPC related options are available:

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml title="options.yml"
grpc:
  enabled: <true|false>
  port: 50051
  log:
    level: "<error|warn|info|debug>"
```

</TabItem>
<TabItem value="env-vars" label="Environment variables">

```shell
CONFIGCAT_GRPC_ENABLED=<true|false>
CONFIGCAT_GRPC_PORT=50051
CONFIGCAT_GRPC_LOG_LEVEL="<error|warn|info|debug>"
```

</TabItem>
</Tabs>

Here's the explanation for each option:

<table className="proxy-arg-table">
<thead><tr><th>Option</th><th>Default</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
grpc:
  enabled: <true|false>
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_GRPC_ENABLED=<true|false>
```

</TabItem>
</Tabs>

</td>
<td><code>true</code></td>
<td>Enables or disables the ability to communicate with the Proxy through gRPC.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
grpc:
  port: 50051
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_GRPC_PORT=50051
```

</TabItem>
</Tabs>

</td>
<td><code>50051</code></td>
<td>The port used for gRPC communication.</td>
</tr>

<tr>
<td>

<Tabs groupId="yaml-env">
<TabItem value="yaml" label="YAML" default>

```yaml
grpc:
  log:
    level: "<error|warn|info|debug>"
```

</TabItem>
<TabItem value="env-vars" label="Environment variable">

```shell
CONFIGCAT_GRPC_LOG_LEVEL="<error|warn|info|debug>"
```

</TabItem>
</Tabs>

</td>
<td><code>warn</code></td>
<td>The verbosity of the gRPC related logs.<br />Possible values: <code>error</code>, <code>warn</code>, <code>info</code> or <code>debug</code>.</td>
</tr>

</tbody>
</table>
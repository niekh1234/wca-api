# WCA Results JSON API

Simple way to get the results from the world cube association website (specifically the results from current record singles and averages) in JSON format.

## Usage

### All results

```bash
curl https://wca-proxy.niekh.com/v1/records
```

### Single result

```bash
curl https://wca-proxy.niekh.com/v1/records/3x3x3
```

## Technical details

- I'm using redis to cache the results for 1 day. I don't want to stress the WCA website too much.
- The results are fetched from the WCA website using cheerio.

### Development

Make sure to copy the `.env.example` file to `.env` and fill in the correct values.

You can spawn a local redis instance using docker:

```bash
docker-compose up -d
```

#### Clearing redis cache (use yarn)

```bash
yarn clear-cache
```
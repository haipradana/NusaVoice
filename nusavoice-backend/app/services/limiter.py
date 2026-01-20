import time
from collections import defaultdict, deque

class SimpleRateLimiter:
    def __init__(self, limit_per_hour: int):
        self.limit = limit_per_hour
        self.window_sec = 3600
        self.hits = defaultdict(deque) #ip->timestamps
        
    def allow(self, key: str) -> tuple[bool, int]:
        '''
        returns (allowed, retry_after_seconds)
        '''
        
        now = time.time()
        q = self.hits[key]
        
        while q and now - q[0] > self.window_sec:
            q.popleft()
            
        if len(q) >= self.limit:
            retry_after = int(self.window_sec - (now - q[0]))
            return (False, max(retry_after, 1))
        
        q.append(now)
        return(True, 0)
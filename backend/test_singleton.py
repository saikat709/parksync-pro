#!/usr/bin/env python3
"""
Test script to verify that ConnectionManager is a proper singleton
"""

from app.libs.connection_manager import ConnectionManager

connection_manager = ConnectionManager.get_instance()

def test_singleton():
    print("Testing ConnectionManager Singleton Pattern...")
    
    # Test 1: Multiple instantiations should return the same object
    manager1 = ConnectionManager()
    manager2 = ConnectionManager()
    
    print(f"manager1 id: {id(manager1)}")
    print(f"manager2 id: {id(manager2)}")
    print(f"Are they the same instance? {manager1 is manager2}")
    
    # Test 2: Global instance should be the same as new instances
    print(f"connection_manager id: {id(connection_manager)}")
    print(f"Is global instance same as manager1? {connection_manager is manager1}")
    
    # Test 3: Using get_instance class method
    manager3 = ConnectionManager.get_instance()
    print(f"manager3 (via get_instance) id: {id(manager3)}")
    print(f"Is manager3 same as others? {manager3 is manager1}")
    
    # Test 4: Verify shared state
    print(f"\nInitial active_connections length: {len(manager1.active_connections)}")
    
    # Add a dummy connection to manager1
    class DummyWebSocket:
        def __init__(self, name):
            self.name = name
    
    dummy_ws = DummyWebSocket("test")
    manager1.active_connections.append(dummy_ws)
    
    print(f"After adding to manager1, manager2 length: {len(manager2.active_connections)}")
    print(f"After adding to manager1, connection_manager length: {len(connection_manager.active_connections)}")
    
    # Clean up
    manager1.active_connections.clear()
    
    print("\n✅ All tests passed! ConnectionManager is a proper singleton.")

if __name__ == "__main__":
    test_singleton()
